# Security Policy / سياسة الأمان

## Supported version
Security fixes target the latest version on `main`.

## Design
Document Toolkit is local-only and does not intentionally make network requests. Markdown conversion escapes raw HTML and only creates links for explicit `http`, `https`, and `mailto` Markdown links. Output overwrite is opt-in. Treat generated HTML as untrusted if the source document itself is untrusted, and review links before opening them.

## Reporting
Please report a suspected vulnerability privately through GitHub's security reporting feature when available. Do not include secrets or private documents in a public issue.

## العربية
تعمل الأداة محليًا ولا تجري طلبات شبكة مقصودة. يتم تهريب HTML الخام أثناء التحويل، ويكون استبدال الملفات اختيارًا صريحًا. تعامل مع HTML الناتج كمدخل غير موثوق إذا كان المستند الأصلي غير موثوق، وراجع الروابط قبل فتحها. أبلغ عن الثغرات بصورة خاصة عبر أدوات GitHub الأمنية عند توفرها، ولا تضع أسرارًا أو مستندات خاصة في Issue عامة.
