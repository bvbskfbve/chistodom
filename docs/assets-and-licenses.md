# Ассеты и атрибуция

## 3D-модели
В этой версии не используется скачанный GLB/GLTF, Sketchfab или иной внешний 3D-ассет. Диван, кресло, матрас и стул собраны из процедурной геометрии Three.js в `components/FurnitureScene.tsx`; геометрия и материалы созданы для этого шаблона. Это позволяет передавать исходники без отдельной лицензии на модель. Варианты размеров пока меняют тариф, не геометрию.

## Изображения, иконки и шрифты
- Иллюстрации 3D создаются в браузере из геометрии.
- PWA-иконка — собственный SVG в `public/icons` и PNG-производные.
- UI-иконки — библиотека Lucide React.
- Используется системный стек шрифтов, внешние веб-шрифты не загружаются.
- Нет внешних фотобанков и изображений комнаты.

## Библиотеки
Основные upstream-проекты и лицензии, которые следует сверить с фактически установленными версиями перед коммерческой передачей:
- Next.js — https://github.com/vercel/next.js (MIT)
- React — https://github.com/facebook/react (MIT)
- Three.js — https://github.com/mrdoob/three.js (MIT)
- React Three Fiber — https://github.com/pmndrs/react-three-fiber (MIT)
- Drei — https://github.com/pmndrs/drei (MIT)
- Motion — https://github.com/motiondivision/motion (MIT)
- Lucide — https://github.com/lucide-icons/lucide (ISC)
- Prisma — https://github.com/prisma/prisma (Apache-2.0)
- Sharp — https://github.com/lovell/sharp (Apache-2.0)
- Zod — https://github.com/colinhacks/zod (MIT)
- bcryptjs — https://github.com/dcodeIO/bcrypt.js (BSD-3-Clause)

Код этого шаблона распространяется по MIT; перед коммерческой перепродажей заполните `[Copyright Holder]` в `LICENSE`. Полный перечень прямых зависимостей зафиксирован в `package.json`. `package-lock.json` пока отсутствует, потому что среда сборки не смогла разрешить `registry.npmjs.org`; после `npm install` сохраните сгенерированный lock-файл в поставке. Лицензии транзитивных зависимостей следует проверить сканером лицензий после установки.

## Blender
`bpy` и Blender MCP не доступны в этой среде. `.blend` не создан; процедурные исходники Three.js — источник 3D-геометрии в MVP.

## Фото и приватное хранение

В development фото лежат в локальной папке `UPLOAD_DIR`. В production нужен закрытый S3-compatible bucket; приложение использует серверный AWS SDK для записи, чтения и удаления объектов. Не включайте публичный доступ на bucket. Доступ к фото проходит через проверку токена заявки или сессии администратора.
