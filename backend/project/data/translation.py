from modeltranslation.translator import register, TranslationOptions
from .models import SalonCategory

@register(SalonCategory)
class SalonCategoryTransaltionOptions(TranslationOptions):
    fields = (
        'name',
    )

