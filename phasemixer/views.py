from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from PIL import Image
import json




@csrf_protect
@csrf_exempt
def home(request):
    return render(request, 'home.html')

@csrf_protect
@csrf_exempt
def upload(request):
    if request.method == 'POST':
        file = request.FILES['file']
        location = request.POST['location']
        file_path = "phasemixer/static/images/" + location + ".png"

        img = Image.open(file)
        img.save(file_path)
        return JsonResponse(
            {
                'Status': "Saved at" + file_path
            }
        )

