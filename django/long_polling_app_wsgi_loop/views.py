from django.http import JsonResponse
from django.views import View
import time
import json
from .utils.redis_client import redis_client
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt  # In order to prevent CSRF for the post request while testing with Curl

from redis.exceptions import RedisError

# 1. Using loop [Trivial Solution, Not efficient]
# def poll(request, client_id):
#         timeout = 30  # timeout of the long polling in seconds
#         poll_interval = 1 # Check for new messages every 1 second
#         start_time = time.time()

#         while time.time() - start_time < timeout:
#             try:
#                 message = redis_client.lpop(f"messages:{client_id}")
#                 print("doing long polling")
#                 if message:
#                    # If there's any message, return immediately
#                    data = json.loads(message)
#                    return JsonResponse([data.get('message')],safe=False, status=200)
#             except RedisError as e:
#                    # Handle Redis errors
#                    print(f"Redis error while polling: {e}")
#                    return JsonResponse({'error': 'Temporary server issue. Please retry.'}, status=503)

#             # No message yet, wait a bit
#             time.sleep(poll_interval)

#         # Timeout reached, return empty response
#         return JsonResponse({'message': None}, status=204)


# def send_message(request):
#         data = json.loads(request.body)
#         recipient = data.get('to')
#         message_content = data.get('message')
#         print("to: ", recipient)
#         print("message: ", message_content)
#         message = {
#         'to': recipient,
#         'message': message_content,
#          }
#         print("message received: ", message)
#         redis_client.rpush(f"messages:{recipient}", json.dumps(message))
#         return JsonResponse({'status': 'message sent'}, status=200)


# @method_decorator(csrf_exempt, name='dispatch')
# class LongPollingView(View):
    
#     def get(self, request,  client_id):
#         print("client connected: ", client_id)
#         return poll(request, client_id)
    
#     def post(self, request, *args, client_id):
#         return send_message(request)


# 2. Using BLPOP Redis, [More efficient]

def poll(request, client_id):
    timeout = 30  # timeout in seconds

    print(f"Waiting for message from client: {client_id}")
    try:
       result = redis_client.blpop(f"messages:{client_id}", timeout=timeout)

       if result:
           key, message = result
           print(f"Message received from Redis: {message}")
           data = json.loads(message)
           return JsonResponse([data.get('message')], safe=False, status=200)
       else:
           print("No message received, timeout.")
           return JsonResponse({'message': None}, status=204)
    except RedisError as e:
        print(f"Redis error while polling: {e}")
        # Handle the logic here, Eg. get data from the database 
        return JsonResponse({'error': 'Temporary server issue. Please retry.'}, status=503)

    except json.JSONDecodeError:
        print("Invalid JSON in Redis message.")
        return JsonResponse({'error': 'Corrupt message data'}, status=500)

def send_message(request):
    data = json.loads(request.body)
    recipient = data.get('to')
    message_content = data.get('message')
    print("to: ", recipient)
    print("message: ", message_content)
    message = {
        'to': recipient,
        'message': message_content,
    }
    print("message received: ", message)
    try:
       redis_client.rpush(f"messages:{recipient}", json.dumps(message))
       return JsonResponse({'status': 'message sent'}, status=200)
    except RedisError as e:
           # Handle Redis errors
           print(f"Redis error while sending: {e}")
           return JsonResponse({'error': 'Failed to send message'}, status=503)

@method_decorator(csrf_exempt, name='dispatch')
class LongPollingView(View):
    
    def get(self, request, client_id):
        print("Client connected:", client_id)
        return poll(request, client_id)
    
    def post(self, request, client_id):
        return send_message(request)
