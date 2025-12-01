# 🗂️ CustomTabs

สร้างแท็บสำหรับจัดกลุ่มเนื้อหาและการนำทางที่ปรับแต่งได้

## 🔧 วิธีใช้งานพื้นฐาน

```tsx
// ตัวอย่างการใช้งาน
<CustomTabs 
  defaultValue="profile"
  tabs={[
    { value: 'profile', label: 'โปรไฟล์' },
    { value: 'settings', label: 'ตั้งค่า' },
    { value: 'billing', label: 'การชำระเงิน' },
  ]}
>
  <CustomTabContent value="profile">
    <div>เนื้อหาโปรไฟล์</div>
  </CustomTabContent>
  <CustomTabContent value="settings">
    <div>ตั้งค่าระบบ</div>
  </CustomTabContent>
  <CustomTabContent value="billing">
    <div>ข้อมูลการชำระเงิน</div>
  </CustomTabContent>
</CustomTabs>
```

## 🎨 ตัวเลือกการแสดงผล

### การจัดวาง
| ค่า | ลักษณะ |
|------|---------|
| `horizontal` | แท็บแนวนอน (ค่าเริ่มต้น) |
| `vertical` | แท็บแนวตั้ง |

### สไตล์
- `tabListClassName` - คลาส CSS สำหรับแถบแท็บ
- `tabTriggerClassName` - คลาส CSS สำหรับปุ่มแท็บ
- `tabContentClassName` - คลาส CSS สำหรับเนื้อหาแท็บ
- `className` - คลาส CSS สำหรับคอมโพเนนต์ทั้งหมด

## ⚙️ คุณสมบัติที่สำคัญ

### ข้อมูลพื้นฐาน
- `tabs` (ต้องระบุ) - อาร์เรย์ของแท็บ `{ value: string, label: string, disabled?: boolean }`
- `defaultValue` - ค่าเริ่มต้นของแท็บที่เลือก
- `value` - ค่าปัจจุบัน (สำหรับควบคุมจากภายนอก)
- `onValueChange` - ฟังก์ชันที่ทำงานเมื่อเปลี่ยนแท็บ

### การทำงาน
- `disabled` - ปิดการใช้งานแท็บทั้งหมด
- `loop` - วนลูปเมื่อกดปุ่ม Tab (ค่าเริ่มต้น: true)
- `orientation` - การจัดวางแท็บ (`horizontal` หรือ `vertical`)

## 📱 ตัวอย่างการใช้งานจริง

### แท็บแนวนอน
```tsx
const [activeTab, setActiveTab] = useState('profile');

<CustomTabs 
  value={activeTab}
  onValueChange={setActiveTab}
  tabs={[
    { value: 'profile', label: 'โปรไฟล์' },
    { value: 'settings', label: 'ตั้งค่า' },
    { value: 'billing', label: 'การชำระเงิน' },
  ]}
  className="w-full"
  tabListClassName="border-b"
  tabTriggerClassName="data-[state=active]:border-b-2 data-[state=active]:border-primary"
>
  <CustomTabContent value="profile">
    <ProfileForm />
  </CustomTabContent>
  
  <CustomTabContent value="settings">
    <SettingsForm />
  </CustomTabContent>
  
  <CustomTabContent value="billing">
    <BillingInfo />
  </CustomTabContent>
</CustomTabs>
```

### แท็บแนวตั้ง
```tsx
<CustomTabs 
  defaultValue="account"
  orientation="vertical"
  tabs={[
    { value: 'account', label: 'บัญชีผู้ใช้' },
    { value: 'security', label: 'ความปลอดภัย' },
    { value: 'notifications', label: 'การแจ้งเตือน' },
  ]}
  className="flex gap-6"
  tabListClassName="w-48 border-r pr-6"
  tabTriggerClassName="w-full justify-start data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
  tabContentClassName="flex-1"
>
  <CustomTabContent value="account">
    <h2 className="text-2xl font-bold mb-4">บัญชีผู้ใช้</h2>
    <AccountSettings />
  </CustomTabContent>
  
  <CustomTabContent value="security">
    <h2 className="text-2xl font-bold mb-4">ความปลอดภัย</h2>
    <SecuritySettings />
  </CustomTabContent>
  
  <CustomTabContent value="notifications">
    <h2 className="text-2xl font-bold mb-4">การแจ้งเตือน</h2>
    <NotificationSettings />
  </CustomTabContent>
</CustomTabs>
```

### แท็บแบบมีไอคอน
```tsx
import { User, Lock, Bell, CreditCard } from 'lucide-react';

<CustomTabs 
  defaultValue="profile"
  tabs={[
    { 
      value: 'profile', 
      label: (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>โปรไฟล์</span>
        </div>
      ) 
    },
    { 
      value: 'security', 
      label: (
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>ความปลอดภัย</span>
        </div>
      ) 
    },
    { 
      value: 'billing', 
      label: (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span>การชำระเงิน</span>
        </div>
      ) 
    },
  ]}
  tabTriggerClassName="flex items-center gap-2"
>
  <CustomTabContent value="profile">
    <ProfileForm />
  </CustomTabContent>
  
  <CustomTabContent value="security">
    <SecuritySettings />
  </CustomTabContent>
  
  <CustomTabContent value="billing">
    <BillingInfo />
  </CustomTabContent>
</CustomTabs>
```

## 💡 เคล็ดลับ
- ใช้ `orientation="vertical"` สำหรับการแสดงแท็บแนวตั้ง
- ใช้ `disabled` ในรายการแท็บเพื่อปิดการใช้งานแท็บนั้นๆ
- ใช้ `tabListClassName`, `tabTriggerClassName`, และ `tabContentClassName` เพื่อปรับแต่งสไตล์
- ใช้ `onValueChange` เพื่อตรวจจับการเปลี่ยนแท็บ
- ใช้ `value` และ `onValueChange` ร่วมกันเพื่อควบคุมแท็บจากภายนอก
