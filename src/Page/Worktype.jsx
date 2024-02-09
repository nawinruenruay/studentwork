import { ActionIcon, Flex, Modal, Button, TextInput } from "@mantine/core";
import { IconEdit, IconPlus, IconTrash, IconEye } from "@tabler/icons-react";
import axios from "axios";
import { MDBDataTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Wortype() {
  const [Table, setTable] = useState([]);
  const [ModalAdd, setModalAdd] = useState(false);
  const [ModalEdit, setModalEdit] = useState(false);
  const [Worktype, setWorktype] = useState({
    wtid: "",
    wtname: "",
  });

  const column = [
    {
      label: "รหัสประเภทผลงาน",
      field: "wtid",
    },
    {
      label: "ชื่อประเภทผลงาน",
      field: "wtname",
    },
    {
      label: "จัดการ",
      field: "manage",
    },
  ];

  const Fetch = () => {
    axios.get("http://localhost:9999/worktypelist").then((res) => {
      console.log(res.data);
      const data = res.data;
      if (data.length !== 0) {
        setTable({
          columns: column,
          rows: [
            ...data.map((i, key) => ({
              wtid: i.wtid,
              wtname: i.wtname,
              manage: (
                <>
                  <Flex gap="xs" justify="center" align="center">
                    <ActionIcon
                      onClick={() => {
                        getWtEdit(i.wtid);
                        setModalEdit(true);
                      }}
                    >
                      <IconEdit />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => handleDelete(i.wtid)}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Flex>
                </>
              ),
            })),
          ],
        });
      }
    });
  };

  useEffect(() => {
    Fetch();
  }, []);

  const handleChange = (e) => {
    setWorktype((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddWt = () => {
    if (!Worktype.wtname) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบ",
        text: "ชื่อประเภทผลงาน",
      });
      return;
    }
    try {
      axios.post("http://localhost:9999/worktypeadd", Worktype).then(() => {
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลสำเร็จ",
          showConfirmButton: false,
          timer: 2000,
        });
        setModalAdd(false);
        Fetch();
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err,
      });
    }
  };

  const getWtEdit = (v) => {
    axios.get("http://localhost:9999/worktype/" + v).then((res) => {
      setWorktype(res.data[0]);
    });
  };

  const handleEditWt = () => {
    if (!Worktype.wtname) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบ",
        text: "ชื่อประเภทผลงาน",
      });
      return;
    }
    try {
      axios.post("http://localhost:9999/worktypeedit", Worktype);
      Swal.fire({
        icon: "success",
        title: "แก้ไขข้อมูลสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
      setModalEdit(false);
      Fetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถแก้ไขข้อมูลได้",
      });
    }
  };

  const handleDelete = (wtid) => {
    Swal.fire({
      title: "คุณต้องการลบข้อมูล?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD3333",
      cancelButtonColor: "#000000",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:9999/worktypedel/${wtid}`)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "ลบข้อมูลสำเร็จ",
              showConfirmButton: false,
              timer: 1500,
            });
            Fetch();
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถลบข้อมูลได้",
            });
          });
      }
    });
  };

  return (
    <div style={{ background: "#f0f2f8", padding: "28px" }}>
      <div
        style={{
          marginBottom: "15px",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <Flex direction={{ base: "column", sm: "row" }} justify="flex-end">
          <Button
            variant="filled"
            color="#3366FF"
            leftSection={<IconPlus />}
            style={{ fontSize: "0.8rem" }}
            onClick={() => setModalAdd(true)}
          >
            เพิ่มข้อมูลประเภทผลงาน
          </Button>
        </Flex>
      </div>
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <MDBDataTable
          bordered
          hover
          data={Table}
          noBottomColumns
          small
          noRecordsFoundLabel="ไม่พบข้อมูล"
          searchLabel="ค้นหา"
          // theadColor="black"
          // theadTextWhite
          // striped
          disableRetreatAfterSorting
        />
      </div>

      {/* เพิ่มข้อมูล */}
      <Modal
        opened={ModalAdd}
        onClose={() => {
          setModalAdd(false);
        }}
        title="เพิ่มข้อมูลประเภทผลงาน"
        centered
      >
        <TextInput
          placeholder="กรอกชื่อประเภทผลงาน"
          label="ชื่อประเภทผลงาน"
          onChange={handleChange}
          name="wtname"
          withAsterisk
        />
        <Button fullWidth mt="md" color="#3366FF" onClick={handleAddWt}>
          บันทึกข้อมูล
        </Button>
      </Modal>

      {/* แก้ไขข้อมูล */}
      <Modal
        opened={ModalEdit}
        onClose={() => {
          setModalEdit(false);
        }}
        title="แก้ไขข้อมูลประเภทผลงาน"
        centered
      >
        <TextInput
          placeholder="กรอกชื่อประเภทผลงาน"
          label="ชื่อประเภทผลงาน"
          name="wtname"
          value={Worktype.wtname}
          onChange={handleChange}
          withAsterisk
        />

        <Button fullWidth mt="md" color="#3366FF" onClick={handleEditWt}>
          แก้ไขข้อมูล
        </Button>
      </Modal>
    </div>
  );
}

export default Wortype;
