import re

# Đọc file
with open('d:/Code-FE/weeding-AT/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Tìm và xóa phần code lỗi từ dòng 3341 đến 3370
# Pattern: từ "if (isHeartsEnabled)" đến "</script>" thứ 2
pattern = r'    if \(isHeartsEnabled\) \{.*?    \}\)\(\);\s*</script>'

# Xóa pattern
content_cleaned = re.sub(pattern, '', content, flags=re.DOTALL)

# Ghi lại file
with open('d:/Code-FE/weeding-AT/index.html', 'w', encoding='utf-8') as f:
    f.write(content_cleaned)

print("✅ Đã xóa code lỗi thành công!")
