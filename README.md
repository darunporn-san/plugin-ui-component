## ui-plugin — UI Components Library

คอมโพเนนต์ UI แบบ reusable (React + Tailwind + Radix/shadcn) สำหรับนำไปใช้ในโปรเจกต์อื่น

### โครงสร้างสำคัญ
- `src/index.ts` จุดรวม export คอมโพเนนต์/ยูทิล
- `src/components/ui/*` คอมโพเนนต์หลัก
- `src/lib/utils.ts` ยูทิลิตี้ classnames ฯลฯ
- `dist/` โฟลเดอร์ไฟล์ build ที่จะถูกใช้งานเมื่อ publish/install

### สคริปต์ที่มีให้
- `yarn dev` เปิดโหมด watch-build ด้วย tsup
- `yarn build` สร้างแพ็กเกจลง `dist/` (esm + cjs + .d.ts)
- `yarn lint` ตรวจโค้ด
- `yarn format` จัดรูปแบบโค้ด

### การติดตั้งและตั้งค่า

#### 1. ติดตั้ง dependencies

```bash
# ติดตั้งแพ็คเกจและตั้งค่าอัตโนมัติ
npm install ui-plugin

yarn add git+https://github.com/darunporn-san/plugin-ui-component.git
# หรือ
# yarn add ui-plugin

# ระบบจะถามประเภทแอปพลิเคชัน (admin หรือ ecommerce) ให้เลือกในขั้นตอนถัดไป
```

#### 2. เลือกประเภทแอปพลิเคชัน

ในระหว่างการติดตั้ง ระบบจะถามว่าต้องการติดตั้งสำหรับ:
- `admin` - สำหรับส่วนจัดการหลังบ้าน
- `ecommerce` - สำหรับส่วนหน้าร้านค้าออนไลน์

ระบบจะสร้าง/อัปเดตไฟล์ `.env.local` โดยอัตโนมัติ

### การพัฒนา (Local Development)
1) ติดตั้ง dependencies

```bash
yarn
```

2) โหมดพัฒนา (watch)

```bash
yarn dev
```

3) สร้างไฟล์สำหรับแจกจ่าย

```bash
yarn build
```

ผลลัพธ์จะอยู่ที่ `dist/` และถูกอ้างอิงโดย `main/module/types` ใน `package.json`

### การใช้งาน shadcn/ui CLI ในแพ็กเกจนี้
- มีการตั้งค่า `tailwind.config.js`, `postcss.config.js` และ `components.json` สำหรับ shadcn/ui แล้ว
- รันคำสั่งด้านล่างเพื่อเปิด CLI:

```bash
yarn shadcn init   # สามารถใช้ npx shadcn@latest init ก็ได้
```

- หลังจาก init แล้ว สามารถเพิ่มคอมโพเนนต์ด้วย:

```bash
yarn shadcn add button
```

- CLI จะสร้างไฟล์ไว้ใน `src/components/ui/*` และใช้ `src/styles/globals.css` เป็นไฟล์ Tailwind หลัก
- หากต้องการเปลี่ยนสไตล์/พาธ ปรับค่าใน `components.json`

### การใช้งานในโปรเจกต์อื่น (Consumers)
แพ็กเกจนี้เป็น React UI library ที่ต้องพึ่งพาสิ่งต่อไปนี้ในโปรเจกต์ปลายทาง (peerDependencies):
- `react` ^19
- `react-dom` ^19
- `tailwindcss` ^3.4

โปรเจกต์ปลายทางควร:
- ตั้งค่า Tailwind ให้ถูกต้อง (content, theme, ฯลฯ)
- ติดตั้งและเพิ่มปลั๊กอิน `tailwindcss-animate` (แพ็กเกจนี้ใช้คลาส animate ต่างๆ)

ถ้าใช้ Next.js (App Router หรือ Pages) ต้องตั้งค่า `transpilePackages` ให้ transpile แพ็กเกจนี้ด้วย เพื่อหลีกเลี่ยงปัญหา ESM/CJS/TS ไม่ถูกแปลง:

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['ui-plugin'],
};

module.exports = nextConfig;
```

ตัวอย่างการติดตั้งในโปรเจกต์ปลายทาง (ถ้าเผยแพร่ขึ้น registry แล้ว):

```bash
# สมมุติชื่อแพ็กเกจคือ ui-plugin
npm i ui-plugin react@^19 react-dom@^19 tailwindcss@^3
```

การนำเข้าใช้งาน:

```tsx
import { CustomButton } from 'ui-plugin';

export default function Page() {
  return <CustomButton>Click me</CustomButton>;
}
```

หมายเหตุ: แพ็กเกจนี้ใช้ Tailwind utility classes ดังนั้นโปรเจกต์ปลายทางต้องมี Tailwind ทำงานอยู่แล้ว (รวมถึง `tailwindcss-animate`) เพื่อให้สไตล์แสดงผลถูกต้อง

### ทดสอบใช้งานแบบ Local (ก่อน publish)
เลือกได้ตามความถนัดอย่างใดอย่างหนึ่ง:

1) ติดตั้งแบบไฟล์ระบบ (absolute path install)
```bash
# ภายในโปรเจกต์ปลายทาง
npm i /absolute/path/to/Mint/Plugin/ui-plugin
```

2) ใช้ link
```bash
# ภายใน ui-plugin
yarn build && yarn link

# ภายในโปรเจกต์ปลายทาง
yarn link ui-plugin
```

3) ใช้ tarball
```bash
# ภายใน ui-plugin
npm pack  # ได้ไฟล์ .tgz

# ภายในโปรเจกต์ปลายทาง
npm i ../path/to/ui-plugin-0.1.0.tgz
```

### การเผยแพร่ (ถ้าต้องการ publish)
1) อัปเดตเวอร์ชันใน `package.json`
2) สร้างไฟล์ build
```bash
yarn build
```
3) ลงชื่อเข้า registry แล้ว publish
```bash
npm publish --access public
```

### ห้ามลบ/แก้ไขสิ่งต่อไปนี้ (ไม่เช่นนั้นจะติดตั้ง/ใช้งานในโปรเจกต์อื่นไม่ได้)
- ฟิลด์ต่อไปนี้ใน `package.json`:
  - `name` และ `version`
  - `main`: ชี้ไป `dist/index.js`
  - `module`: ชี้ไป `dist/index.mjs`
  - `types`: ชี้ไป `dist/index.d.ts`
  - `files`: ต้องมี `"dist"` เพื่อให้ไฟล์ build ถูกแพ็กตอน publish
  - `peerDependencies`: ต้องมี `react`, `react-dom`, `tailwindcss` ตามเวอร์ชันที่กำหนด
- โฟลเดอร์ `dist/` หลังจาก build: ต้องมีอยู่ตอน publish/ติดตั้งจากแพ็กเกจ (อย่าลบก่อนเผยแพร่)
- จุดเข้า `src/index.ts`: ต้อง export คอมโพเนนต์/ยูทิลที่ต้องการใช้งานให้ครบ
- การตั้งค่า build (`tsup.config.ts`): อย่าเอา `external: ['react','react-dom']` ออก เพื่อหลีกเลี่ยงการ bundle React เข้าแพ็กเกจ

### หมายเหตุเพิ่มเติม
- แพ็กเกจนี้พึ่งพา Tailwind ที่ฝั่งโปรเจกต์ปลายทาง จึงไม่ bundle CSS มาให้เอง
- ถ้ามีไฟล์สไตล์เฉพาะ (`src/styles/*`) ที่ต้องการให้ผู้ใช้ import เอง โปรดระบุวิธีในเอกสารนี้เพิ่มเติม (เช่น `import 'ui-plugin/dist/styles.css';`) และปรับระบบ build ให้ปล่อยไฟล์นั้นลง `dist/`


# plugin-ui-component
