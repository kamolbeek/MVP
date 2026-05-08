# Edit Kuzatuvchi Telegram Bot

Ushbu bot Telegram guruhlaridagi xabarlar tahrirlanganida (o'zgartirilganida), bu haqida admin guruhiga to'liq ma'lumot jo'natuvchi dasturdir. U tahrirlashdan oldingi eski matnni o'zida saqlaydi va nima o'zgarish bo'lganini (difflib yordamida) ko'rsatib beradi.

## Fayllar strukturasi

- `bot.py` - Asosiy bot logikasi va kodi.
- `.env` - Token va Admin guruh ID si saqlanadigan maxfiy fayl.
- `requirements.txt` - Python kutubxonalari ro'yxati.
- `README.md` - Ushbu qo'llanma.

## Qadamma-qadam ishga tushirish (Mac uchun)

**1-qadam: Terminalni oching va loyiha papkasiga kiring**
```bash
cd "/Users/ilevel/Documents/MVP loyiha/bot"
```

**2-qadam: Virtual muhit (venv) yarating va faollashtiring (ixtiyoriy, lekin tavsiya etiladi)**
```bash
python3 -m venv venv
source venv/bin/activate
```

**3-qadam: Kerakli kutubxonalarni o'rnating**
```bash
pip install -r requirements.txt
```

**4-qadam: Bot token va Admin guruhni sozlang**
Loyihada joylashgan `.env` faylini oching (VS Code yoki har qanday tekst redaktorida) va quyidagilarni o'zgartiring:
- `TOKEN` - @BotFather orqali yaratgan botingizning tokeni.
- `ADMIN_GROUP_ID` - Bot xabar yuborishi kerak bo'lgan "Admin" guruhingiz ID-si (masalan, `-100123456789`). Uni bilish uchun @ShowJsonBot kabi botlardan foydalanishingiz mumkin. Yoki oddiy o'zingizning chat id ingizni yozsangiz, bot sizning shaxsiy lichkangizga yozadi.

*Muhim:* Bot guruhdagi xabarlarni o'qiy olishi uchun, botni guruhga qo'shgach guruhda admin qilishingiz yoki BotFather dan `Group Privacy` sozlamasini o'chirib qo'yishingiz kerak.

**5-qadam: Botni ishga tushiring**
```bash
python3 bot.py
```
Terminalda "Bot muvaffaqiyatli ishga tushdi!" degan yozuv chiqadi. Endi qaysi guruhlarga ushbu bot qo'shilgan bo'lsa, kimdir xabarni o'zgartirganda bot buni darhol sezadi va adminga hisobot beradi!
