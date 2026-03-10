#!/bin/bash

# Скрипт для сборки, ad-hoc подписи и установки Browserosaurus локально
# Использует ad-hoc подпись (не требует Apple Developer аккаунт)

set -e  # Выход при ошибкеecho "🚀 Начинаю сборку Browserosaurus..."

# Определяем архитектуру
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
    echo "📱 Обнаружена архитектура: Apple Silicon (ARM64)"
    ARCH_FLAG="arm64"
elif [ "$ARCH" = "x86_64" ]; then
    echo "💻 Обнаружена архитектура: Intel (x64)"
    ARCH_FLAG="x64"
else
    echo "❌ Неизвестная архитектура: $ARCH"
    exit 1
fi
# Очищаем предыдущую сборку
echo "🧹 Очистка предыдущей сборки..."
rm -rf out

# Собираем приложение без официальной подписи (CI=true отключает osxSign)
echo "📦 Сборка приложения для архитектуры $ARCH_FLAG..."
CI=true NODE_ENV=production npx electron-forge package --platform=darwin --arch=$ARCH_FLAG

# Electron Forge создаёт папку с заглавной буквы: Browserosaurus-darwin-<arch>
if [ "$ARCH_FLAG" = "arm64" ]; then
    APP_PATH="out/Browserosaurus-darwin-arm64/Browserosaurus.app"
elif [ "$ARCH_FLAG" = "x64" ]; then
    APP_PATH="out/Browserosaurus-darwin-x64/Browserosaurus.app"
fi

if [ ! -d "$APP_PATH" ]; then
    echo "❌ Приложение не найдено по пути: $APP_PATH"
    exit 1
fi

echo "✅ Приложение собрано: $APP_PATH"

# Ad-hoc подпись (не требует Apple Developer аккаунт)
echo "✍️  Подписываю приложение ad-hoc сертификатом..."
codesign --force --deep --sign - "$APP_PATH"

echo "✅ Приложение подписано"

# Копируем в ~/Applications
APP_NAME="Browserosaurus.app"
DEST_PATH="$HOME/Applications/$APP_NAME"

if [ -d "$DEST_PATH" ]; then
    echo "🗑️  Удаляю старую версию из $DEST_PATH..."
    rm -rf "$DEST_PATH"
fi

echo "📥 Копирую приложение в $DEST_PATH"
mkdir -p "$HOME/Applications"
cp -R "$APP_PATH" "$DEST_PATH"

echo "✅ Приложение успешно установлено в $DEST_PATH"

# Очистка временной папки сборки
echo "🧹 Очищаю временную папку сборки..."
rm -rf out

echo ""
echo "🎉 Готово! Теперь можно запустить Browserosaurus из $DEST_PATH"
