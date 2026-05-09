import os
import difflib
import logging
from datetime import datetime
import pytz
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes

# 1. Atrof-muhit o'zgaruvchilarini yuklash (.env faylidan)
load_dotenv()

TOKEN = os.getenv("TOKEN")
ADMIN_GROUP_ID = os.getenv("ADMIN_GROUP_ID")

# 2. Loggerni sozlash (xatoliklarni terminalda ko'rish uchun)
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# 3. Toshkent vaqt zonasi
TZ_TASHKENT = pytz.timezone('Asia/Tashkent')

def get_diff(old_text: str, new_text: str) -> str:
    """Matnlar o'rtasidagi o'zgarishlarni topish (so'zma-so'z)"""
    if not old_text:
        old_text = ""
    if not new_text:
        new_text = ""
        
    # Difflib yordamida o'zgarishlarni aniqlash
    d = difflib.ndiff(old_text.split(), new_text.split())
    deleted = []
    added = []
    
    for word in d:
        if word.startswith('- '):
            deleted.append(word[2:])
        elif word.startswith('+ '):
            added.append(word[2:])
            
    result_lines = []
    if deleted:
        result_lines.append(f"{' '.join(deleted)} ❌")
    if added:
        result_lines.append(f"{' '.join(added)} ✅")
            
    if not result_lines:
        return "Faqat bo'shliqlar (probellar) yoki ko'zga ko'rinmas belgilar o'zgargan"
    return "\n".join(result_lines)

async def handle_new_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Barcha yangi xabarlarni xotirada (bot_data) saqlab borish"""
    if not update.message:
        return
        
    chat_id = update.message.chat_id
    message_id = update.message.message_id
    # Xabar matni yoki rasmga biriktirilgan izohni olish
    text = update.message.text or update.message.caption or ""
    
    # Ma'lumotlarni saqlash tuzilmasini yaratish
    if 'messages' not in context.bot_data:
        context.bot_data['messages'] = {}
        
    if chat_id not in context.bot_data['messages']:
        context.bot_data['messages'][chat_id] = {}
        
    # Xabarni guruh va xabar ID si bo'yicha saqlash
    context.bot_data['messages'][chat_id][message_id] = text
    logger.info(f"Yangi xabar saqlandi: {chat_id} - {message_id}")

async def handle_edited_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Xabar tahrirlanganda uni ushlash va adminga yuborish"""
    logger.info("Tahrirlangan xabar ushlandi!")
    if not update.edited_message:
        logger.info("Lekin update.edited_message bo'sh.")
        return

    try:
        msg = update.edited_message
        chat_id = msg.chat_id
        message_id = msg.message_id
        # Yangi (tahrirlangan) matnni olish
        new_text = msg.text or msg.caption or ""
        
        # Foydalanuvchi ma'lumotlarini aniqlash (username yoki ism-familiya)
        user = msg.from_user
        if user.username:
            user_info = f"@{user.username}"
        else:
            user_info = f"{user.first_name} {user.last_name or ''}".strip()
            
        chat_title = msg.chat.title or "Shaxsiy chat/Noma'lum guruh"
        
        # Vaqtni olish va Toshkent vaqtiga o'tkazish
        edit_date = msg.edit_date.astimezone(TZ_TASHKENT)
        time_str = edit_date.strftime('%Y-%m-%d %H:%M:%S')
        
        # Eski xabarni xotiradan olish (bot_data)
        if 'messages' not in context.bot_data or chat_id not in context.bot_data['messages'] or message_id not in context.bot_data['messages'][chat_id]:
            # Agar xabar bot ishga tushmasdan oldin yozilgan bo'lsa, bizda uning eski nusxasi yo'q.
            # Shuning uchun uning nimasini o'zgartirganini aniqlay olmaymiz va e'tiborsiz qoldiramiz.
            return
            
        old_text = context.bot_data['messages'][chat_id][message_id]
            
        # Agar matn umuman o'zgarmagan bo'lsa (faqat tugma yoki ko'rinmas probel o'zgargan bo'lsa), e'tibor bermaymiz
        if old_text.strip() == new_text.strip():
            return
            
        # Agar kompyuter o'chib qolib, tahrir qilinganiga 24 soatdan oshib ketgan xabarlar kelsa, ularni e'tiborsiz qoldiramiz
        from datetime import timezone
        if (datetime.now(timezone.utc) - msg.edit_date).total_seconds() > 86400:
            return
            
        # O'zgarishlarni aniqlash funksiyasiga yuborish
        diff_result = get_diff(old_text, new_text)
        
        # Adminga yuboriladigan yakuniy xabar formati
        report = (
            f"✏️ <b>Xabar tahrirlandi!</b>\n\n"
            f"👤 <b>Kim:</b> {user_info}\n"
            f"💬 <b>Qaysi chat:</b> {chat_title}\n"
            f"🕐 <b>Vaqt:</b> {time_str}\n\n"
            f"❌ <b>Eski matn:</b>\n{old_text}\n\n"
            f"✅ <b>Yangi matn:</b>\n{new_text}\n\n"
            f"🔍 <b>O'zgarish:</b>\n{diff_result}"
        )
        
        # Keyingi tahrirlar uchun yangi xabarni xotirada yangilab qo'yish
        if 'messages' not in context.bot_data:
            context.bot_data['messages'] = {}
        if chat_id not in context.bot_data['messages']:
            context.bot_data['messages'][chat_id] = {}
        context.bot_data['messages'][chat_id][message_id] = new_text

        # O'zgargan xabarni aynan xabar tahrirlangan guruhning o'ziga yuborish
        await context.bot.send_message(
            chat_id=chat_id,
            message_thread_id=msg.message_thread_id,
            reply_to_message_id=message_id,
            text=report,
            parse_mode='HTML'
        )
            
    except Exception as e:
        logger.error(f"Xatolik yuz berdi: {e}")

def main():
    """Asosiy funksiya - botni ishga tushiradi"""
    if not TOKEN:
        logger.error("Bot tokeni topilmadi! Iltimos .env faylini to'ldiring.")
        return

    # Application obyekti orqali botni yaratish
    application = ApplicationBuilder().token(TOKEN).build()

    # 1-qadam: Barcha yangi xabarlarni doim saqlab borish (matnli va rasmli xabarlar)
    application.add_handler(MessageHandler(filters.UpdateType.MESSAGE & (filters.TEXT | filters.CAPTION), handle_new_message))
    
    # 2-qadam: Faqatgina TAHRIRLANGAN xabarlarni ushlash va report qilish
    application.add_handler(MessageHandler(filters.UpdateType.EDITED_MESSAGE & (filters.TEXT | filters.CAPTION), handle_edited_message))

    logger.info("Bot muvaffaqiyatli ishga tushdi! Xabarlar kuzatilmoqda...")
    
    # Botni polling rejimida to'xtovsiz ishlashga qo'yish
    application.run_polling()

if __name__ == '__main__':
    main()
