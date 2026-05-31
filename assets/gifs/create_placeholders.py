"""
生成占位符 GIF 图片
运行此脚本生成小熊的占位符图片，之后可以替换为真实的自嘲熊 GIF
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder_gif(filename, text, bg_color, size=(180, 180)):
    """创建一个简单的占位符 GIF"""
    frames = []

    for i in range(2):  # 2帧简单动画
        img = Image.new('RGBA', size, (0, 0, 0, 0))  # 透明背景
        draw = ImageDraw.Draw(img)

        # 画一个简单的圆形作为熊脸
        center = (size[0] // 2, size[1] // 2)
        radius = 70
        draw.ellipse(
            [center[0] - radius, center[1] - radius,
             center[0] + radius, center[1] + radius],
            fill=bg_color
        )

        # 画眼睛
        eye_y = center[1] - 15
        draw.ellipse([center[0] - 25, eye_y - 8, center[0] - 15, eye_y + 8], fill='black')
        draw.ellipse([center[0] + 15, eye_y - 8, center[0] + 25, eye_y + 8], fill='black')

        # 画嘴巴
        if i == 0:
            # 微笑
            draw.arc([center[0] - 20, center[1], center[0] + 20, center[1] + 20],
                    0, 180, fill='black', width=2)
        else:
            # 张嘴
            draw.ellipse([center[0] - 15, center[1], center[0] + 15, center[1] + 15],
                        fill='black')

        # 画耳朵
        draw.ellipse([center[0] - 65, center[1] - 65, center[0] - 35, center[1] - 35],
                    fill=bg_color, outline='black')
        draw.ellipse([center[0] + 35, center[1] - 65, center[0] + 65, center[1] - 35],
                    fill=bg_color, outline='black')

        # 添加文字
        try:
            font = ImageFont.truetype("msyh.ttc", 14)
        except:
            font = ImageFont.load_default()

        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_x = (size[0] - text_width) // 2
        draw.text((text_x, size[1] - 30), text, fill='black', font=font)

        frames.append(img)

    # 保存为 GIF
    output_path = os.path.join(os.path.dirname(__file__), filename)
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=500,
        loop=0,
        transparency=0
    )
    print(f"Created: {output_path}")

if __name__ == '__main__':
    # 创建正常状态的小熊
    create_placeholder_gif('bear-normal.gif', '(◕‿◕)', (255, 200, 150))

    # 创建愤怒状态的小熊
    create_placeholder_gif('bear-angry.gif', '(╬▔皿▔)', (255, 150, 150))

    print("\n占位符图片创建完成！")
    print("请将真实的自嘲熊 GIF 图片替换到 assets/gifs/ 目录中")
    print("- bear-normal.gif: 正常/可爱状态")
    print("- bear-angry.gif: 愤怒/警告状态")
