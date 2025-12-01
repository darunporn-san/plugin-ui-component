# 📤 FileUpload

อัปโหลดไฟล์ได้หลายไฟล์ พร้อมแสดงตัวอย่างไฟล์และรองรับการลากวาง

## 🔧 วิธีใช้งานพื้นฐาน

```tsx
// ตัวอย่างการใช้งาน
const [files, setFiles] = useState([]);

<FileUpload
  accept={{
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'application/pdf': ['.pdf']
  }}
  maxSize={5 * 1024 * 1024} // 5MB
  maxFiles={5}
  onFilesSelected={setFiles}
  isUploading={false}
  uploadButtonText="อัปโหลดไฟล์"
  dropzoneText="ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์"
  dropzoneActiveText="ปล่อยไฟล์ที่นี่เพื่ออัปโหลด"
/>
```

## 🎨 ตัวเลือกการแสดงผล

### ประเภทไฟล์ที่รองรับ
| ประเภท | นามสกุล |
|--------|---------|
| รูปภาพ | .png, .jpg, .jpeg, .gif |
| เอกสาร | .pdf, .doc, .docx, .xls, .xlsx |
| อื่นๆ | กำหนดเองได้ |

### ขนาดไฟล์
- `maxSize` - ขนาดไฟล์สูงสุด (ค่าเริ่มต้น: 5MB)
- `maxFiles` - จำนวนไฟล์สูงสุด (ค่าเริ่มต้น: 5)

## ⚙️ คุณสมบัติที่สำคัญ

### ข้อมูลพื้นฐาน
- `accept` - ประเภทไฟล์ที่ยอมรับ (Object หรือ MIME type)
- `multiple` - อนุญาตให้อัปโหลดหลายไฟล์ (ค่าเริ่มต้น: true)
- `disabled` - ปิดการใช้งาน

### การทำงาน
- `onFilesSelected` - ฟังก์ชันที่ทำงานเมื่อเลือกไฟล์
- `onFileRemove` - ฟังก์ชันที่ทำงานเมื่อลบไฟล์
- `onError` - ฟังก์ชันที่ทำงานเมื่อเกิดข้อผิดพลาด
- `isUploading` - สถานะการอัปโหลด

### การแสดงผล
- `showFileList` - แสดงรายการไฟล์ (ค่าเริ่มต้น: true)
- `showPreview` - แสดงตัวอย่างไฟล์ (ค่าเริ่มต้น: true)
- `uploadButtonText` - ข้อความปุ่มอัปโหลด
- `dropzoneText` - ข้อความแสดงเมื่อลากไฟล์
- `dropzoneActiveText` - ข้อความแสดงเมื่อวางไฟล์

## 📱 ตัวอย่างการใช้งานจริง

### อัปโหลดรูปโปรไฟล์
```tsx
const [avatar, setAvatar] = useState(null);

<FileUpload
  accept={{
    'image/*': ['.png', '.jpg', '.jpeg']
  }}
  maxSize={2 * 1024 * 1024} // 2MB
  maxFiles={1}
  onFilesSelected={(files) => setAvatar(files[0])}
  uploadButtonText="เลือกรูปโปรไฟล์"
  dropzoneText="ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกรูปภาพ"
  className="w-64 h-64 border-2 border-dashed rounded-lg flex items-center justify-center"
  showFileList={false}
>
  {!avatar ? (
    <div className="text-center p-4">
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        <span className="font-medium text-primary">อัปโหลดรูปภาพ</span> หรือลากมาวางที่นี่
      </p>
      <p className="text-xs text-gray-500 mt-1">PNG, JPG สูงสุด 2MB</p>
    </div>
  ) : (
    <div className="relative w-full h-full">
      <img
        src={URL.createObjectURL(avatar)}
        alt="Preview"
        className="w-full h-full object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={() => setAvatar(null)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )}
</FileUpload>
```

### อัปโหลดหลายไฟล์
```tsx
const [documents, setDocuments] = useState([]);

<FileUpload
  accept={{
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
  }}
  maxSize={10 * 1024 * 1024} // 10MB
  maxFiles={10}
  onFilesSelected={setDocuments}
  uploadButtonText="เพิ่มเอกสาร"
  dropzoneText="ลากเอกสารมาวางที่นี่ หรือคลิกเพื่อเลือกเอกสาร"
  className="border-2 border-dashed rounded-lg p-4"
>
  {documents.length > 0 && (
    <div className="mt-4 space-y-2">
      <h4 className="font-medium">เอกสารที่เลือก ({documents.length})</h4>
      <div className="space-y-2">
        {documents.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <span className="text-sm">{file.name}</span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const newFiles = [...documents];
                newFiles.splice(index, 1);
                setDocuments(newFiles);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
</FileUpload>
```

## 💡 เคล็ดลับ
- ใช้ `accept` เพื่อจำกัดประเภทไฟล์ที่อนุญาต
- ใช้ `maxSize` เพื่อจำกัดขนาดไฟล์
- ใช้ `maxFiles` เพื่อจำกัดจำนวนไฟล์
- ใช้ `isUploading` เพื่อแสดงสถานะการอัปโหลด
- ใช้ children เพื่อปรับแต่งการแสดงผลตามความต้องการ
