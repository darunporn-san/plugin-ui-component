import Swal from "sweetalert2";
const A = (o: any) => Swal.fire(o);

export const alert = {
  success: (t: string) => A({ icon: "success", title: "สำเร็จ", text: t }),
  error:   (t: string) => A({ icon: "error", title: "ผิดพลาด", text: t }),
  info:    (t: string) => A({ icon: "info", title: "แจ้งให้ทราบ", text: t }),

  confirm: (o: any) =>
    A({
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      ...o,
    }),
};

export default alert;
