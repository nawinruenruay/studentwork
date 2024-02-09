import { ActionIcon, Flex, Modal, Button, TextInput } from "@mantine/core";
import { IconEdit, IconPlus, IconTrash, IconEye } from "@tabler/icons-react";
import axios from "axios";
import { MDBDataTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Student() {
  const [ModalEdit, setModalEdit] = useState(false);
  const [ModalAdd, setModalAdd] = useState(false);
  const [Table, setTable] = useState([]);
  const [Student, setStudent] = useState({
    stdid: "",
    stdname: "",
  });

  const column = [
    {
      label: "รหัสนักศึกษา",
      field: "stdid",
    },
    {
      label: "ชื่อ-นามสกุล",
      field: "stdname",
    },
    {
      label: "จัดการ",
      field: "manage",
    },
  ];

  // const [FF, setFF] = useState([]);
  // const GetData = (v) => {
  // axios.get("http://localhost:9999/studentsSelect/" + v).then((res) => {
  //   localStorage.setItem("stuid", v);
  //     setFF(res.data[0]);
  //     setStuname(res.data[0].stuname);
  //   });
  //   setModalEdit(true);
  // };

  const Fetch = () => {
    axios.get("http://localhost:9999/studentlist").then((res) => {
      console.log(res.data);
      const data = res.data;
      if (data.length !== 0) {
        setTable({
          columns: column,
          rows: [
            ...data.map((i, key) => ({
              stdid: i.stdid,
              stdname: i.stdname,
              manage: (
                <>
                  <Flex gap="xs" justify="center" align="center">
                    <ActionIcon
                      onClick={() => {
                        getStuEdit(i.stdid);
                        setModalEdit(true);
                      }}
                    >
                      <IconEdit />
                    </ActionIcon>

                    <ActionIcon
                      color="red"
                      onClick={() => handleDelete(i.stdid)}
                    >
                      <IconTrash />
                    </ActionIcon>
                    <ActionIcon color="green" onClick={{}}>
                      <IconEye />
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
    setStudent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddStu = () => {
    if (!Student.stdid || !Student.stdname) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบ",
        text: "รหัสนักศึกษาและชื่อ-นามสกุล",
      });
      return;
    }
    try {
      axios.post("http://localhost:9999/studentadd", Student).then(() => {
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

  const getStuEdit = (v) => {
    axios.get("http://localhost:9999/student/" + v).then((res) => {
      setStudent(res.data[0]);
    });
  };

  const handleEditStu = () => {
    if (!Student.stdid || !Student.stdname) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบ",
        text: "ชื่อ-นามสกุล",
      });
      return;
    }
    try {
      axios.post("http://localhost:9999/studentedit", Student);
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

  const handleDelete = (stdid) => {
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
          .delete(`http://localhost:9999/studentdel/${stdid}`)
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
            เพิ่มข้อมูลนักศึกษา
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
      {/* <Modal
        title={localStorage.getItem("stuid")}
        opened={OpenModal}
        onClose={() => {
          localStorage.removeItem("stuid");
          setOpenModal(false);
        }}
        centered
      >
        {FF.stuname}
      </Modal> */}

      {/* เพิ่มข้อมูล */}
      <Modal
        opened={ModalAdd}
        onClose={() => {
          setModalAdd(false);
        }}
        title="เพิ่มข้อมูลนักศึกษา"
        centered
      >
        <TextInput
          placeholder="กรอกรหัสนักศึกษา"
          label="รหัสนักศึกษา"
          onChange={handleChange}
          name="stdid"
          withAsterisk
        />
        <TextInput
          placeholder="กรอกชื่อ-นามสกุล"
          label="ชื่อ-นามสกุล"
          name="stdname"
          onChange={handleChange}
          withAsterisk
        />
        <Button fullWidth mt="md" color="#3366FF" onClick={handleAddStu}>
          บันทึกข้อมูล
        </Button>
      </Modal>

      {/* แก้ไขข้อมูล */}
      <Modal
        opened={ModalEdit}
        onClose={() => {
          setModalEdit(false);
        }}
        title="แก้ไขข้อมูลนักศึกษา"
        centered
      >
        <TextInput
          placeholder="กรอกชื่อ-นามสกุล"
          label="ชื่อ-นามสกุล"
          name="stdname"
          value={Student.stdname}
          onChange={handleChange}
          withAsterisk
        />

        <Button fullWidth mt="md" color="#3366FF" onClick={handleEditStu}>
          แก้ไขข้อมูล
        </Button>
      </Modal>
    </div>
  );
}

export default Student;
