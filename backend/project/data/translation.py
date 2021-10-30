from modeltranslation.translator import register, TranslationOptions
from .models import BusinessCategory


@register(BusinessCategory)
class BusinessCategoryTransaltionOptions(TranslationOptions):
    fields = ('name', )
