from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def hello(request):
    return JsonResponse({'message': 'Hello from Django!'})

def getOrder(request):
    return JsonResponse({'message': 'get order', 
                         'coffee_bean': '1',
                         'nutrient':{'item1': False, 'item2': False, 'item3': False, 'item4': False}, 
                         'caffeine_level': 50,
                         'sugar_level': 50,
                         'brew_temp':90
                         })