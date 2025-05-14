import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message, Profile
from .utils import translate_text

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender_id']
        receiver_id = data['receiver_id']

        try:
            sender_profile = await sync_to_async(Profile.objects.get)(user_id=sender_id)
            receiver_profile = await sync_to_async(Profile.objects.get)(user_id=receiver_id)
        except Profile.DoesNotExist:
            await self.send(text_data=json.dumps({"error": "Invalid sender or receiver."}))
            return

        # Ensure only authorized users can send messages
        if not sender_profile.is_patient and not sender_profile.is_doctor:
            await self.send(text_data=json.dumps({"error": "Unauthorized access."}))
            return
        
            # Enforce role-based access
        if sender_profile.is_patient and not receiver_profile.is_doctor:
            await self.send(text_data=json.dumps({"error": "Patients can only send messages to doctors."}))
            return
        if sender_profile.is_doctor and not receiver_profile.is_patient:
            await self.send(text_data=json.dumps({"error": "Doctors can only send messages to patients."}))
            return
        
        # Translate the message if needed
        sender_language = sender_profile.language.language_code
        receiver_language = receiver_profile.language.language_code
        if sender_language != receiver_language:
            translated_message = await sync_to_async(translate_text)(
                message, sender_language, receiver_language
            )
        else:
            translated_message = message

        # Save the message to the database
        await sync_to_async(self.save_message)(
            sender_id, receiver_id, message, translated_message
        )

        # Send the translated message to the receiver
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': translated_message,
                'sender_id': sender_id,
                'receiver_id': receiver_id,
            }
        )

    async def chat_message(self, event):
        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'receiver_id': event['receiver_id'],
        }))

    def save_message(self, sender_id, receiver_id, original_message, translated_message):
        sender = Profile.objects.get(user_id=sender_id)
        receiver = Profile.objects.get(user_id=receiver_id)
        Message.objects.create(
            sender=sender.user,
            receiver=receiver.user,
            text=original_message,
            translated_text=translated_message,
            language=sender.language
        )