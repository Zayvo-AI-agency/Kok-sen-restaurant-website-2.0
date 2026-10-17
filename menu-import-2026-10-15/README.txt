SMALL ZIP DOWNLOAD EDITION — KOK SEN CLIENT MENU

The same original menu package is now supplied in 10 normal ZIP files.
All 10 are required. They are independent importable ZIPs, not .001 archive fragments.
Original photo bytes, names, categories, IDs and image paths are unchanged.

IN AI STUDIO
1. Download all 10 ZIP files.
2. Open the existing project: File Explorer > + > Upload Zip file.
3. Import Part 01, then Part 02 through Part 10, using the same project root each time. Save the imported changes.
4. The folders must merge into the same root public/kok-sen-menu-2026-10-15 and data folders. If the importer places each ZIP in its own wrapper, the AI assistant must consolidate the contents into the intended root paths.
5. Only after ALL parts are present, send the AI-STUDIO-PROMPT.txt text or the chat prompt provided with the downloads.

Part 01 includes the full JSON catalogue, detailed prompt, review sheet, validation script and this instructions file. The other parts contain additional original photos and a part inventory. A complete installation has 100 image files, 99 publishable named menu items and one unnamed frog photo awaiting client confirmation.

Do not run a menu replacement after importing only Part 01. The included validation script will flag photos missing from any unimported part. Once every part is imported, the normal validation and integration instructions apply.


ORIGINAL PACKAGE REFERENCE
KOK SEN — CLIENT MENU REPLACEMENT, 15 OCTOBER 2026

This ZIP is an import package for the existing website, not a complete replacement website.
Its public/, data/ and menu-import-2026-10-15/ directories are AT THE ZIP ROOT. There is no extra enclosing directory.

IMPORT
1. In the existing AI Studio project, use File Explorer > + > Upload Zip file.
2. Select Kok-Sen-New-Menu-2026-10-15.zip and Save.
3. Send the entire text in menu-import-2026-10-15/AI-STUDIO-PROMPT.txt to the coding assistant.
4. Inspect the preview and the assistant's verification report before publishing.

CONTENTS
- data/kok-sen-menu-2026-10-15.json: authoritative replacement catalogue and exact per-dish photo paths.
- public/kok-sen-menu-2026-10-15/: all 100 original photo files, renamed to clear URL-safe filenames and organised by category. File bytes are unchanged.
- menu-import-2026-10-15/MENU-REVIEW.html: open after extracting to review all 100 photos, cleaned names and original filenames together.
- menu-import-2026-10-15/CLIENT-REVIEW.txt: the unnamed frog photo and the two uncategorised standalone dishes.
- menu-import-2026-10-15/VALIDATION.json: file, count and hash validation results.

SOURCE LIMITATIONS
The client archive contains photo files, not a written menu document. There are 100 photos: 99 have usable dish names in their filenames; one frog photo is named BackgroundEraser_20260906_131532826.png. That photo is included but publish=false until the client supplies its exact dish name. None of the images have been generated, retouched, resized or recompressed. Transparent areas and original image quality are preserved.

Names have only been cleaned for casing, obvious spelling errors and filename artefacts. Crab/Rice are added where the enclosing client category supplies that context. Every exact original filename is stored in each item's source record. No descriptions, Chinese translations, prices, sizes, allergens or availability claims were invented.

The 14 client source categories remain separate; green is displayed as Vegetables, noodle as Noodles, and hor fun remains separate from Noodles. Golden Dragon Chicken was supplied as a standalone file and is grouped with Chicken based on its explicit name. Yam Ring and Yam Paste had no source category and are kept under a neutral Additional Dishes group. This is a packaging/display group, not a claimed official category. Within each category, source archive order is retained; the client did not supply a separate display order.

IMPORTANT
Use item.photo.asset for the browser image URL; it begins /kok-sen-menu-2026-10-15/. The corresponding file is under public/. Never put /public/ in the browser src.
All old photo-map/Oddle fallbacks must be disconnected from the new menu resolver. An image load error must not become a missing dish or be replaced with another food photo.
The files are original size: about 376 MB of image bytes. Some have very large pixel dimensions. This package prioritises faithful original photos; load images lazily and keep image decoding asynchronous. Any later web optimisation must preserve the correct photo mapping and transparency.
