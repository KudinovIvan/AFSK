from django.shortcuts import render
from django.views import View


class IndexView(View):
    @staticmethod
    def get(request):
        return render(request, template_name='index.html', context={})


class LinksView(View):
    @staticmethod
    def get(request):
        return render(request, template_name='links.html', context={})


class LoginView(View):
    @staticmethod
    def get(request):
        return render(request, template_name='login.html', context={})


class Monitoring(View):
    @staticmethod
    def get(request):
        return render(request, template_name='monitoring.html', context={})
