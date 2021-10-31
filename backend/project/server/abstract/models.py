from django.db import models

COLORS = (
    ('light-blue', 'Jasny niebieski'),
    ('light-green', 'Jasny Zielony'),
    ('black', 'Czarny'),
    ('blue', 'Niebieski'),
    ('green', 'Zielony'),
    ('pink', 'Różowy'),
    ('purple', 'Fioletowy'),
    ('brown', 'Brązowy'),
    ('yellow', 'Żółty'),
    ('orange', 'Pomarańczowy'),
)


class Color(models.Model):
    color = models.CharField(max_length=15,
                             choices=COLORS,
                             default=COLORS[0][0])

    class Meta:
        abstract = True


class Group(models.Model):
    name = models.CharField(max_length=30, unique=True)
    parent = models.ForeignKey('self',
                               on_delete=models.CASCADE,
                               blank=True,
                               null=True,
                               related_name='children')

    def __str__(self):
        full_path = [self.name]
        k = self.parent

        while k is not None:
            full_path.append(k.name)
            k = k.parent

        return ' -> '.join(full_path[::-1])

    class Meta:
        abstract = True
