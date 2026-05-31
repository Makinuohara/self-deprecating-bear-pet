"""
生成占位符图标
"""

from PIL import Image, ImageDraw
import os

def create_icon(size=32):
    """创建一个简单的托盘图标"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 画一个简单的圆形
    center = size // 2
    radius = size // 2 - 2
    draw.ellipse(
        [center - radius, center - radius, center + radius, center + radius],
        fill=(255, 200, 150)
    )

    # 画眼睛
    eye_y = center - 3
    draw.ellipse([center - 6, eye_y - 2, center - 3, eye_y + 2], fill='black')
    draw.ellipse([center + 3, eye_y - 2, center + 6, eye_y + 2], fill='black')

    # 画嘴巴
    draw.arc([center - 5, center + 2, center + 5, center + 8],
            0, 180, fill='black', width=1)

    return img

if __name__ == '__main__':
    output_path = os.path.join(os.path.dirname(__file__), 'tray.png')
    icon = create_icon()
    icon.save(output_path)
    print(f"Created: {output_path}")
