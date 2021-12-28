from django.db import models
import uuid


class Results(models.Model):
    class Meta:
        verbose_name_plural = 'Results'
        ordering = ('guid', )

    guid = models.UUIDField(
        primary_key=True, editable=False, default=uuid.uuid4)
    cep = models.ImageField(upload_to="", null=True)
    dcp = models.ImageField(upload_to="", null=True)
    original = models.ImageField(upload_to="", null=True)

    cep_time = models.CharField(max_length=20, null=True, blank=True)
    original_time = models.CharField(max_length=20, default='NA')
    dcp_time = models.CharField(max_length=20, null=True, blank=True)

    cep_sharpness = models.CharField(max_length=200, blank=True, null=True)
    dcp_sharpness = models.CharField(max_length=200, blank=True, null=True)
    original_sharpness = models.CharField(
        max_length=200, blank=True, null=True)

    def __str__(self) -> str:
        return str(self.guid)
