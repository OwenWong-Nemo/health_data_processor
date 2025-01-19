# Analyse data

# Ideally the metrics will be passed to a tuned LLM
def get_mood_score_change(diff_percent):
    if diff_percent > 30:
        return 2
    elif diff_percent > 15:
        return 1
    elif diff_percent > -15:
        return 0
    elif diff_percent > -30:
        return -1
    else:
        return -2

def determine_mood_and_coffee(data):
    mood_score = 0

    # Correctly access each metric's 'diff %'
    for metric in data:
        if 'diff %' in metric:
            mood_score += get_mood_score_change(metric['diff %'])

    # Determine mood from the mood score
    mood = 'Positive' if mood_score > 1 else 'Neutral' if mood_score > -1 else 'Negative'

    # Simple logic to choose coffee type based on mood, could be expanded
    coffee_type = 'Latte' if mood == 'Positive' else 'Cappuccino' if mood == 'Neutral' else 'Mocha'
    caffeine_level = 'High' if mood == 'Positive' else 'Medium' if mood == 'Neutral' else 'Low'
    sugar_level = 'Low' if mood == 'Positive' else 'Medium' if mood == 'Neutral' else 'High'

    return {
        'Coffee Type': coffee_type,
        'Caffeine Level': caffeine_level,
        'Sugar Level': sugar_level,
        'Additive': "protein, iron, omega-3"
    }

# Correct the data format and function call if needed
# result = determine_mood_and_coffee(data)
# print("Coffee Recommendation:", result)
