from pathlib import Path

html_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Icons preview</title>
</head>
<style>
    body {
        font-family: Geneva, Arial, Helvetica, sans-serif;
    }

    .header {
        text-align: center;
        margin: 0 auto;
        font-size: 3rem;
        padding-bottom: 30px;
    }

    .preview-icons {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        max-width: 800px;
        margin: 0 auto;
        grid-gap: 10px;
    }

    .preview-icons .icon {
        text-align: center;
    }

    .preview-icons .icon svg {
        width: 100px;
        height: 100px;
    }

    .preview-icons label {
        display: block;
    }
</style>
<body>
    <div class="header">JetBrains icons preview</div>
    <div class="preview-icons">
        [ICONS]
    </div>
</body>
</html>'''

icons = []

for icon_path in Path('src').glob('*.svg'):
    with icon_path.open() as f:
        icon_svg = f.read()
    icons.append(f'''
        <div class="icon">
            <div class="icon-svg">
                {icon_svg}
            </div>
            <label>{icon_path.stem}</label>
        </div>
    ''')

with open('preview.html', 'w') as f:
    f.write(html_template.replace('[ICONS]', ''.join(icons)))