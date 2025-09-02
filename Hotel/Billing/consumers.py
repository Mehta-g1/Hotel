# Topic Consumer
# More on consumer and routing
# Real time data example
# WebSocket API in JavaScript

from channels.consumer import SyncConsumer, AsyncConsumer
from channels.exceptions import StopConsumer
from .models import Dishes, BillItem, Bill, Cashier
import json
from django.shortcuts import get_object_or_404
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
                if dish.is_available:
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

            message = {
                'messageType':"Dishes",
                "message":dishes
            }
            self.send({
                'type':'websocket.send',
                'text':json.dumps(message)
            })
        else :
            data={'messageType':'SuccessMessage'}
            
            billData =json.loads(event['text'])
            self.send({
                'type':'websocket.send',
                'text':json.dumps({
                    'messageType':"SuccessMessage",
                    'message':"Bill Data received"
                })
            })
            billData = billData[1::]
            try:
                casher_id = 2
                cashier = get_object_or_404(Cashier, pk=casher_id)
                subData={'cashier':cashier.chashier_name}
                bill = Bill.objects.create(cashier_name = cashier, subtotal=0.0, taxAmt=0.0)
                subData['billNo']=bill.id
                total_subtotal = 0.0
                taxAmount=0.0
                bill_items_to_create = []
                Submain= []
                subBillItem = []
                for e in range(len(billData)):
                    
                    id = billData[e].get('id')
                    qty = billData[e].get('qty')

                    dish = get_object_or_404(Dishes, pk = id)
                    item_price = dish.price
                    item_total = int(qty) * int(item_price)

                    total_subtotal += int(item_total)
                    
                    bill_items_to_create.append(
                        BillItem(
                            bill=bill,
                            dish=dish,
                            quantity=qty,
                            price=item_price
                        )
                    )
                    subBillItem.append({'item': dish.dish_name, 'quantity':qty, 'price':item_price})
                    Submain.append(subBillItem)
                    subData['total']=total_subtotal

                print(Submain)
                BillItem.objects.bulk_create(bill_items_to_create)
                
                qty={''}
                taxAmount= total_subtotal*(5/100)
                bill.subtotal = total_subtotal + taxAmount
                subData['subtotal']=total_subtotal
                subData['taxAmount']=taxAmount
                bill.save()
            except Exception as e:
                print(e)

            data['message']= subData,subBillItem

            
            self.send({
                'type':'websocket.send',
                'text':json.dumps(data)
            })
            print('Bill information sent successfully')
            # print(bill)
            # cashier_name=bill.cashier_name
            # subtotal=bill.subtotal
            # items=bill.items
            # print(bill.dish_name)


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