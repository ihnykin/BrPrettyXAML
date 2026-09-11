import sys
import os

def main():
    if len(sys.argv) < 2:
        print("Ошибка: Скрипту не передан путь к файлу.")
        sys.exit(1)
        
    target_file_path = sys.argv[1]
    
    if not os.path.exists(target_file_path):
        print(f"Ошибка: Файл не найден по пути: {target_file_path}")
        sys.exit(1)
        
    try:
        with open(target_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # =======================================================
        # МЕСТО ДЛЯ ВАШЕЙ ЛОГИКИ ФОРМАТИРОВАНИЯ (Pretty XML/XAML)
        # =======================================================
        if not content.startswith("<!-- Processed by BrPrettyXAML -->"):
            modified_content = "<!-- Processed by BrPrettyXAML -->\n" + content
            
            with open(target_file_path, 'w', encoding='utf-8') as f:
                f.write(modified_content)
                
            print(f"Успех! Файл '{os.path.basename(target_file_path)}' был изменен.")
        else:
            print(f"Файл '{os.path.basename(target_file_path)}' уже был обработан ранее.")
            
    except Exception as e:
        print(f"Критическая ошибка при обработке файла: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
