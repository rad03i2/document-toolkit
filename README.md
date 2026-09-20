# Document Toolkit

A local, dependency-free Node.js CLI for practical document operations: inspect text/Markdown documents, normalize line endings and whitespace, and convert a useful Markdown subset to standalone HTML.

> English documentation is followed by complete Arabic documentation below.

## Why it exists
Small document tasks should not require uploading private text to a website or installing a large office suite. Document Toolkit provides deterministic, scriptable operations that run entirely on your machine.

## Features
- `stats` — count bytes, characters, words, lines, headings and links; text or JSON output.
- `normalize` — normalize LF/CRLF, trim trailing whitespace, cap excessive blank lines, and optionally ensure a final newline.
- `markdown-html` — convert headings, paragraphs, lists, fenced code, blockquotes, links, emphasis and inline code to a complete UTF-8 HTML document.
- Safe output behavior: refuses to overwrite files unless `--overwrite` is explicit.
- No network access, telemetry, accounts, API keys, or runtime dependencies.
- Cross-platform Node.js 20+ CLI with automated tests.

## Preview
This is a terminal application. A useful repository screenshot is a terminal showing `stats` and `markdown-html` followed by the generated HTML opened in a browser. No screenshot is bundled so the repository does not present a fabricated UI.

## Requirements
- Node.js 20 or newer

## Installation
```bash
git clone https://github.com/rad03i2/document-toolkit.git
cd document-toolkit
npm install
npm test
npm link
```
`npm install` installs no runtime packages; it only creates normal npm metadata when needed.

## Usage
```bash
doc-toolkit stats README.md
doc-toolkit stats README.md --json
doc-toolkit normalize notes.txt notes.clean.txt --eol lf --final-newline
doc-toolkit markdown-html README.md preview.html
```
Without `npm link`, use `node src/cli.js ...`.

### Commands
```text
stats <input> [--json]
normalize <input> <output> [--eol lf|crlf] [--final-newline] [--overwrite]
markdown-html <input> <output> [--title "Title"] [--overwrite]
--version
--help
```

## Configuration
There is no configuration file and no environment-variable requirement. Options are explicit CLI flags. Input is decoded as UTF-8; malformed UTF-8 is rejected rather than silently corrupted.

## Project structure
```text
src/cli.js            CLI, validation and file I/O
src/core.js           Pure document operations
examples/sample.md    Example input
test/core.test.js     Unit tests
test/cli.test.js      End-to-end CLI tests
.github/workflows/ci.yml
```

## Testing
```bash
npm test
npm run check
```
Tests exercise statistics, normalization, Markdown escaping/rendering, CLI JSON output, conversion, and overwrite protection. CI runs syntax checks and tests on Ubuntu, Windows and macOS with Node.js 20 and 22.

## Security & privacy
All processing is local. HTML conversion escapes raw document text before rendering supported Markdown constructs. The converter intentionally does not pass arbitrary raw HTML through. Output files are created with exclusive semantics by default. See [SECURITY.md](SECURITY.md).

## Limitations
- UTF-8 text and Markdown only; this project does not parse PDF, DOCX, ODT, or legacy encodings.
- The Markdown renderer intentionally implements a practical subset, not the full CommonMark specification.
- Tables, footnotes, nested lists, images and raw HTML passthrough are not supported.
- Operations read a document into memory, so this is not intended for multi-gigabyte files.

## Optional roadmap
Full CommonMark support and streaming statistics could be added later without changing the current CLI contract.

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md). Please keep changes focused, tested, dependency-light, and privacy-preserving.

## License
MIT — see [LICENSE](LICENSE).

## Author
**Radwan Abdulhadi Ahmed**  
**رضوان عبدالهادي أحمد**  
GitHub: **@rad03i2**

---

# العربية

## مجموعة أدوات المستندات
أداة سطر أوامر محلية وخفيفة مبنية على Node.js لتنفيذ عمليات عملية على الملفات النصية وMarkdown بدون رفع المستندات إلى أي خدمة خارجية.

## لماذا هذا المشروع؟
المهام البسيطة مثل معرفة إحصاءات مستند أو توحيد نهايات الأسطر أو إنشاء نسخة HTML لا ينبغي أن تتطلب رفع نصوص خاصة إلى الإنترنت أو تثبيت حزمة مكتبية كبيرة. تنفذ الأداة العمليات بصورة محلية وقابلة للأتمتة.

## المزايا
- `stats`: حساب البايتات والمحارف والكلمات والأسطر والعناوين والروابط مع إخراج نصي أو JSON.
- `normalize`: توحيد نهايات الأسطر إلى LF أو CRLF، حذف الفراغات في نهايات الأسطر، تقليل الأسطر الفارغة الزائدة، وإضافة سطر نهائي اختياريًا.
- `markdown-html`: تحويل مجموعة عملية من Markdown إلى صفحة HTML مستقلة UTF-8، وتشمل العناوين والفقرات والقوائم ومقاطع الكود والاقتباسات والروابط والتأكيد والكود المضمن.
- لا يتم استبدال ملف موجود إلا عند تمرير `--overwrite` صراحةً.
- لا شبكة ولا تتبع استخدام ولا مفاتيح API ولا اعتماديات تشغيل خارجية.

## المعاينة
المشروع أداة طرفية؛ أفضل لقطة شاشة له هي تشغيل أوامر الإحصاء والتحويل ثم فتح HTML الناتج في المتصفح. لم نضع واجهة وهمية أو صورة توحي بميزة غير موجودة.

## المتطلبات والتثبيت
يتطلب Node.js 20 أو أحدث.
```bash
git clone https://github.com/rad03i2/document-toolkit.git
cd document-toolkit
npm install
npm test
npm link
```

## الاستخدام
```bash
doc-toolkit stats README.md
doc-toolkit stats README.md --json
doc-toolkit normalize notes.txt notes.clean.txt --eol crlf --final-newline
doc-toolkit markdown-html README.md preview.html --title "معاينة"
```
يمكن استخدام `node src/cli.js` بدل `doc-toolkit` دون `npm link`.

## الإعداد
لا يوجد ملف إعداد ولا متغيرات بيئة مطلوبة. جميع الخيارات تمرر صراحة عبر CLI. تُقرأ الملفات بصيغة UTF-8، ويرفض الإدخال غير الصالح بدل إفساد النص بصمت.

## بنية المشروع
الكود النقي في `src/core.js`، وواجهة الأوامر والتحقق والملفات في `src/cli.js`، والاختبارات في `test/`، والمثال في `examples/`، وCI داخل `.github/workflows/`.

## الاختبارات
```bash
npm test
npm run check
```
تغطي الاختبارات الإحصاءات والتطبيع والتحويل والتهريب الآمن لـHTML وJSON وحماية الاستبدال. إعداد CI يشغل الفحص والاختبارات على Linux وWindows وmacOS مع Node 20 و22.

## الأمان والخصوصية
كل المعالجة محلية. يتم تهريب النص الخام عند إنشاء HTML، ولا يمرر المحول HTML خامًا من المستند. كما يمنع استبدال الملفات افتراضيًا. راجع [SECURITY.md](SECURITY.md).

## القيود
- يدعم نص UTF-8 وMarkdown فقط، ولا يقرأ PDF أو DOCX أو ODT.
- محول Markdown مجموعة عملية مقصودة وليس تطبيقًا كاملًا لمعيار CommonMark.
- لا يدعم الجداول والحواشي والقوائم المتداخلة والصور وتمرير HTML الخام.
- تتم قراءة المستند إلى الذاكرة، لذلك ليس مخصصًا للملفات متعددة الجيجابايت.

## تطوير اختياري
يمكن مستقبلًا إضافة CommonMark كامل وإحصاءات streaming دون كسر واجهة الأوامر الحالية.

## المساهمة والترخيص
راجع [CONTRIBUTING.md](CONTRIBUTING.md). المشروع مرخص بترخيص MIT؛ راجع [LICENSE](LICENSE).

## المؤلف
**Radwan Abdulhadi Ahmed**  
**رضوان عبدالهادي أحمد**  
GitHub: **@rad03i2**
