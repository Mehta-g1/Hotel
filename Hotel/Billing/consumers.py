# Topic Consumer
# More on consumer and routing
# Real time data example
# WebSocket API in JavaScript

from channels.consumer import SyncConsumer, AsyncConsumer
from channels.exceptions import StopConsumer
from .models import Dishes
import json
from time import sleep
import asyncio
import json

class MySyncConsumer(SyncConsumer):
    def websocket_connect(self, event):
        print("Websocket Connected...\n")
        self.send({
            'type':'websocket.accept'
        })
 
    def websocket_receive(self, event):
        print("Message received...",event['text'])
        print()
        if event['text'] == "send dishes":
            dishes = []
            for dish in Dishes.objects.all():
                id = dish.id
                name = dish.dish_name
                description = dish.receipe
                price = dish.price
                category = dish.category.category_name
                dishes.append({
                    'id':id,
                    'name':name,
                    'description': description,
                    'price':price,
                    'category': category
                })

            self.send({
                'type':'websocket.send',
                'text':json.dumps(dishes)
            })
  

    def websocket_disconnect(self, event):
        print("Websocket Disconnected ....",event)
        raise StopConsumer()


class MyAsyncConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        print("Websocket Connected...\n")
        await self.send({
            'type':'websocket.accept'
        })

    async def websocket_receive(self, event):
        print("Message received...",event)
        print(event['text'])
        for i in range(10):
            await self.send({
                'type':'websocket.send',
                'text':f'Message from server- {str(i)}'
            })
            await asyncio.sleep(1)

    async def websocket_disconnect(self, event):
        print("Websocket Disconnected ....\n")
        raise StopConsumer()