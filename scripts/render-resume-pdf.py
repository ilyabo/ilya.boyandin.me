"""Render the localized résumé JSON supplied by generate-resume-pdf.mjs."""

import argparse
import json
import sys
import re
from html import escape
from pathlib import Path

from reportlab.lib import colors
import reportlab
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
)

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
resume = json.load(sys.stdin)
language = resume.pop('language')
output = args.output
output.parent.mkdir(parents=True, exist_ok=True)

font_dir = Path('/System/Library/Fonts/Supplemental')
if (font_dir / 'Arial.ttf').is_file() and (font_dir / 'Arial Bold.ttf').is_file():
    normal_font = font_dir / 'Arial.ttf'
    bold_font = font_dir / 'Arial Bold.ttf'
else:
    font_dir = Path(reportlab.__file__).parent / 'fonts'
    normal_font = font_dir / 'Vera.ttf'
    bold_font = font_dir / 'VeraBd.ttf'
pdfmetrics.registerFont(TTFont('CV', str(normal_font)))
pdfmetrics.registerFont(TTFont('CV-Bold', str(bold_font)))
pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold', italic='CV', boldItalic='CV-Bold')
ink = colors.HexColor('#182A36')
muted = colors.HexColor('#5E6B75')
accent = colors.HexColor('#176078')
styles = {
    'name': ParagraphStyle('name', fontName='CV-Bold', fontSize=25, leading=29, textColor=ink, spaceAfter=6),
    'subtitle': ParagraphStyle('subtitle', fontName='CV', fontSize=11.2, leading=15, textColor=accent, spaceAfter=7),
    'contact': ParagraphStyle('contact', fontName='CV', fontSize=9, leading=13, textColor=muted),
    'summary': ParagraphStyle('summary', fontName='CV', fontSize=10.1, leading=14.5, textColor=ink, spaceAfter=12),
    'section': ParagraphStyle('section', fontName='CV-Bold', fontSize=13, leading=17, textColor=accent, spaceBefore=12, spaceAfter=8, keepWithNext=True),
    'job': ParagraphStyle('job', fontName='CV-Bold', fontSize=10.5, leading=14, textColor=ink, keepWithNext=True, spaceAfter=2),
    'dates': ParagraphStyle('dates', fontName='CV', fontSize=9, leading=12, textColor=muted, keepWithNext=True, spaceAfter=5),
    'body': ParagraphStyle('body', fontName='CV', fontSize=10, leading=13.5, textColor=ink, spaceAfter=4),
    'bullet': ParagraphStyle('bullet', fontName='CV', fontSize=10, leading=13.5, textColor=ink, leftIndent=10, firstLineIndent=0, bulletIndent=0, bulletFontName='CV', bulletFontSize=10, spaceAfter=4),
    'label': ParagraphStyle('label', fontName='CV-Bold', fontSize=9.4, leading=12.5, textColor=ink),
    'skills': ParagraphStyle('skills', fontName='CV', fontSize=9.4, leading=12.5, textColor=ink),
    'earlier': ParagraphStyle('earlier', fontName='CV', fontSize=9.2, leading=12.5, textColor=ink, spaceAfter=4),
}

def p(text, style='body'):
    return Paragraph(text, styles[style])

def linked(text):
    text = re.sub(r'href="(/[^"]*)"', r'href="https://ilya.boyandin.me\1"', text)
    return re.sub(
        r'<a href="([^"]+)"[^>]*>(.*?)</a>',
        r'<a href="\1" color="#176078"><u>\2</u></a>',
        text,
        flags=re.DOTALL,
    )

def heading(text):
    return p(escape(text), 'section')

def footer(canvas, doc):
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(colors.HexColor('#D7DFE4'))
    canvas.line(doc.leftMargin, 32, width - doc.rightMargin, 32)
    canvas.setFont('CV', 8)
    canvas.setFillColor(muted)
    prefix = f'{resume["profile"]["name"]} | '
    website = 'ilya.boyandin.me'
    canvas.drawString(doc.leftMargin, 20, prefix + website)
    link_x = doc.leftMargin + pdfmetrics.stringWidth(prefix, 'CV', 8)
    canvas.linkURL('https://ilya.boyandin.me',
                   (link_x, 18, link_x + pdfmetrics.stringWidth(website, 'CV', 8), 28),
                   relative=0, thickness=0)
    canvas.drawRightString(width - doc.rightMargin, 20, str(doc.page))
    canvas.restoreState()

story = [p(escape(resume['profile']['name']), 'name'), p(escape(resume['profile']['subtitle']), 'subtitle')]
contacts = ['<a href="https://ilya.boyandin.me" color="#176078">ilya.boyandin.me</a>']
for contact in resume['profile']['contacts']:
    contacts.append(f'<a href="{escape(contact["href"], quote=True)}" color="#176078">{escape(contact["label"])}</a>')
story.extend([
    p(' | '.join(contacts), 'contact'), Spacer(1, 10),
    HRFlowable(width='100%', thickness=1, color=accent), Spacer(1, 12),
    p(linked(resume['summaryHtml']), 'summary'),
])

experience = next(s for s in resume['sections'] if s['type'] == 'experience')
story.append(heading(experience['title']))
jobs = [job for job in experience['items'] if job['short']]
for index, job in enumerate(jobs):
    if index == 3:
        story.append(PageBreak())
        story.append(heading('Berufserfahrung (Fortsetzung)' if language == 'de' else 'Experience (continued)'))
    title = escape(job['title'])
    if job.get('employer'):
        title += ', ' + escape(job['employer'])
    dates = ' - '.join(value for value in [job['start'], job.get('end')] if value)
    if job.get('location'):
        dates += ' | ' + job['location']
    bullets = [Paragraph(linked(bullet['html']), styles['bullet'], bulletText='\u2022') for bullet in job['bullets'] if bullet['short']]
    story.append(KeepTogether([p(title, 'job'), p(escape(dates), 'dates'), *bullets]))
    story.append(Spacer(1, 7))

earlier = [job for job in experience['items'] if not job['short']][:4]
story.append(heading('Frühere Berufserfahrung (Auswahl)' if language == 'de' else 'Earlier experience (selected)'))
for job in earlier:
    dates = ' - '.join(value for value in [job['start'], job.get('end')] if value)
    title = escape(job['title'])
    employer = escape(job.get('employer', ''))
    story.append(p(f'<b>{title}</b>, {employer}<br/><font color="#5E6B75">{escape(dates)}</font>', 'earlier'))

expertise = next(s for s in resume['sections'] if s['type'] == 'expertise')
story.append(heading(expertise['title']))
skills = [[p(escape(group['label']), 'label'), p(linked(group['html']), 'skills')] for group in expertise['groups'] if group['short']]
table = Table(skills, colWidths=[123, A4[0] - 88 - 123], hAlign='LEFT')
table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('RIGHTPADDING', (0, 0), (0, -1), 10), ('TOPPADDING', (0, 0), (-1, -1), 2),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(table)

education = next(s for s in resume['sections'] if s['type'] == 'education')
story.append(heading(education['title']))
for degree in education['items']:
    if degree['short']:
        story.append(p(f'<b>{escape(degree["title"])}</b>, {escape(degree["institution"])} | {degree["date"]}', 'body'))

doc = SimpleDocTemplate(str(output), pagesize=A4, leftMargin=44, rightMargin=44, topMargin=40, bottomMargin=44,
    title='Ilya Boyandin - Lebenslauf' if language == 'de' else 'Ilya Boyandin - Resume',
    author='Ilya Boyandin', subject=resume['profile']['subtitle'])
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(output)
