from django.http import JsonResponse
from django.views import View
import time
import json
from .utils.redis_client import redis_client
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt  # In order to prevent CSRF for the post request while testing with Curl

def poll(request, client_id):
        timeout = 30  # timeout of the long polling in seconds
        poll_interval = 1 # Check for new messages every 1 second
        start_time = time.time()

        while time.time() - start_time < timeout:
            message = redis_client.lpop(f"messages:{client_id}")
            print("doing long polling")
            if message:
               # If there's any message, return immediately
               data = json.loads(message)
               return JsonResponse([data.get('message')],safe=False, status=200)

            # No message yet, wait a bit
            time.sleep(poll_interval)

        # Timeout reached, return empty response
        return JsonResponse({'message': None}, status=204)


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
        redis_client.rpush(f"messages:{recipient}", json.dumps(message))
        return JsonResponse({'status': 'message sent'}, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class LongPollingView(View):
    
    def get(self, request,  client_id):
        print("client connected: ", client_id)
        return poll(request, client_id)
    
    def post(self, request, *args, client_id):
        return send_message(request)


