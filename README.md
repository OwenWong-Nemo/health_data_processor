# Dependencies
``` pip install Django```

# Usage
Run server
```python manage.py runserver```
Then go to 
http://localhost:8000/api/getOrder/ in web browser. 
It should show 
```
{
    "message": "get order",
    "coffee_bean": "1",
    "nutrient": {
        "item1": false,
        "item2": false,
        "item3": false,
        "item4": false
    },
    "caffeine_level": 50,
    "sugar_level": 50,
    "brew_temp": 90
}
```
this is defined by api\views.py ```getOrder``` function. 
In other words, pls return the actual processing result there