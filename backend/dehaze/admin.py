from django.contrib import admin
from dehaze.models import Results

class ResultsAdmin(admin.ModelAdmin):
    list_display = ["guid"]

admin.site.register(Results, ResultsAdmin)