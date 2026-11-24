# SchoolSupply

Линк за презентацията: https://docs.google.com/presentation/d/1bIUJ0AKOwcesc1Jn2uSGHD8hRbOeGmXJ9xO8BGmNEqg/edit?usp=sharing 

Система за заявки за материали в училище (Node.js + Express + Sequelize/SQLite + React/Vite).

## Стартиране

```bash
# 1) Сървър
cd server
npm install
npm run dev        # http://localhost:5000

# 2) Клиент (втори терминал)
cd client
npm install
npm run dev        # http://localhost:5173
```

Администратор по подразбиране (от server/.env): admin@school.bg / Admin1234

## Администратори

Може да има повече от един администратор. В менюто „Потребители“ (виждат го само администраторите)
всеки администратор може да направи друг потребител администратор или да му отнеме правата.
Не може да промените собствената си роля, така че винаги остава поне един администратор.

Сменете паролата на администратора по подразбиране преди реална употреба.
