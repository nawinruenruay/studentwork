import {
  ActionIcon,
  Flex,
  Modal,
  Button,
  TextInput,
  ScrollArea,
  Select,
  FileInput,
  Input,
  Image,
  rem,
} from "@mantine/core";
import { useFavicon } from "@mantine/hooks";
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconPdf,
  IconVideo,
  IconFilePlus,
  IconPhoto,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import axios from "axios";
import { MDBDataTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Work() {
  const [ModalEdit, setModalEdit] = useState(false);
  const [ModalAdd, setModalAdd] = useState(false);
  const [Table, setTable] = useState([]);
  const [Std, setStd] = useState([]);
  const [Wt, setWt] = useState([]);

  const [Wtid, setWtid] = useState("");
  const [Wname, setWname] = useState("");
  const [Stdid, setStdid] = useState("");
  const [Tw, setTw] = useState("");
  const [File, setFile] = useState([]);

  // const [Video, setVideo] = useState("");
  // const [Link, setLink] = useState("");

  const column = [
    {
      label: "ประเภทผลงาน",
      field: "wtname",
    },
    {
      label: "ชื่อผลงาน",
      field: "wname",
    },
    {
      label: "รหัสนักศึกษา",
      field: "stdid",
    },
    {
      label: "Path",
      field: "pathwork",
    },
    {
      label: "View",
      field: "view",
    },
    {
      label: "จัดการ",
      field: "manage",
    },
  ];

  const [viewModal, setViewModal] = useState(false);
  const [SelectIMG, setSelectIMG] = useState([]);

  const Fetch = () => {
    axios.get("http://localhost:9999/worklist").then((res) => {
      console.log(res.data);
      const data = res.data;
      if (data.length !== 0) {
        setTable({
          columns: column,
          rows: [
            ...data.map((i, key) => ({
              wtname: i.wtname,
              wname: i.wname,
              stdid: i.stdid,
              pathwork: i.pathwork,
              view: (
                <>
                  {i.typework === "PDF" ? (
                    <>
                      <ActionIcon
                        onClick={() => {
                          window.open(
                            "http://localhost:9999/pdf/" + i.pathwork
                          );
                        }}
                      >
                        <IconPdf />
                      </ActionIcon>
                    </>
                  ) : i.typework === "VDO" ? (
                    <>
                      <ActionIcon
                        onClick={() => {
                          window.open(
                            "http://localhost:9999/vdo/" + i.pathwork
                          );
                        }}
                      >
                        <IconVideo />
                      </ActionIcon>
                    </>
                  ) : (
                    <>
                      <ActionIcon
                        onClick={() => {
                          setViewModal(true);
                          setSelectIMG(
                            data.filter(
                              (item) =>
                                item.stdid === i.stdid &&
                                item.wtid === i.wtid &&
                                item.typework === i.typework
                            )
                          );
                        }}
                      >
                        <IconPhoto />
                      </ActionIcon>
                    </>
                  )}
                </>
              ),
              manage: (
                <>
                  <Flex gap="xs" justify="center" align="center">
                    <ActionIcon
                      onClick={() => {
                        edit(i.stdid, i.typework, i.wtid);
                      }}
                    >
                      <IconEdit />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => {
                        handleDelete(i.wid);
                      }}
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
    getStu();
    getWt();
  }, []);

  const getStu = () => {
    axios.get("http://localhost:9999/studentlist").then((res) => {
      setStd(res.data);
    });
  };

  const getWt = () => {
    axios.get("http://localhost:9999/worktypelist").then((res) => {
      setWt(res.data);
    });
  };

  // const handleChange = (e) => {
  //   setWork((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  const edit = (stdid, typework, wtid) => {
    axios
      .post("http://localhost:9999/workstd/", {
        stdid: stdid,
        typework: typework,
        wtid: wtid,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  const handleAddWork = async () => {
    if (!Wtid || !Stdid) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบ",
        text: "รหัสนักศึกษาและประเภทผลงาน",
      });
      return;
    }
    try {
      const count = File.length - 1;
      for (let i = 0; i <= count; i++) {
        const formData = new FormData();
        formData.append("wtid", Wtid);
        formData.append("stdid", Stdid);
        formData.append("wname", Wname);
        formData.append("typework", Tw);
        formData.append("file", File[i]);
        const res = await axios.post(
          "http://localhost:9999/workadd",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (res.statusText === "OK" && i === count) {
          Swal.fire({
            icon: "success",
            title: "บันทึกข้อมูลสำเร็จ",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            setModalAdd(false);
            Fetch();
            setStdid("");
            setFile([]);
          });
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err,
      });
    }
  };

  const handleDelete = (wid) => {
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
          .delete(`http://localhost:9999/workdel/${wid}`)
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

  const [pv, setPv] = useState([]);
  const HandleFile = (val) => {
    setPv([]);
    setFile(val);
    val.forEach((img) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPv((val) => [...val, reader.result]);
      };
      reader.readAsDataURL(img);
    });
    // if (val) {
    // }
  };

  //////////////////////
  // const uploadImage = async () => {
  //   console.log(File);
  //   try {
  //     let i = 0;
  //     const uploadPromises = File.forEach((image, index) => {
  //       const formData = new FormData();
  //       return new Promise((resolve) => {
  //         formData.append("wtid", Wtid);
  //         formData.append("stdid", Stdid);
  //         formData.append("wname", Wname);
  //         formData.append("typework", Tw);
  //         formData.append("file", image);
  //         // console.log(image.File);
  //         axios
  //           .post("http://localhost:9999/workadd", formData, {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           })
  //           .then((res1) => {
  //             console.log(i); // setTimeout(() => {
  //             resolve({
  //               index,
  //               success: res1.statusText === "OK",
  //             });
  //             i++;
  //             // }, 2000);
  //           });
  //       });
  //     });

  //     const results = await Promise.all(uploadPromises);
  //     const allSuccessful = results.every((result) => result.success);

  //     if (allSuccessful === true) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: "Upload completed",
  //       }).then((resp) => {
  //         setModalAdd(false);
  //         Fetch();
  //         setStdid("");
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error during image upload:", error);
  //   }
  // };
  /////////////////////

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
            onClick={() => {
              setPv([]);
              setFile([]);
              setModalAdd(true);
            }}
          >
            เพิ่มข้อมูลผลงาน
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
          // theadColor="white"
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
        title="เพิ่มข้อมูลผลงาน"
        scrollAreaComponent={ScrollArea.Autosize}
        size="50%"
        centered
      >
        <Select
          label="รหัสนักศึกษา"
          placeholder="เลือกรหัสนักศึกษา"
          data={Std.map((Std) => Std.stdid)}
          clearable
          name="stdid"
          onChange={(value) => setStdid(value)}
          checkIconPosition="right"
          searchable
          withAsterisk
        />
        <Select
          label="ชื่อประเภทผลงาน"
          placeholder="เลือกชื่อประเภทผลงาน"
          data={Wt.map((Wt) => Wt.wtname)}
          clearable
          name="wtid"
          checkIconPosition="right"
          searchable
          withAsterisk
          onChange={(value) => {
            const select = Wt.find((item) => item.wtname === value);
            if (select) {
              setWtid(select.wtid);
            }
          }}
        />
        <Select
          label="ผลงานประเภท"
          placeholder="ผลงานประเภทไหน ? VDO , PIC , PDF"
          data={["VDO", "PIC", "PDF"]}
          clearable
          name="typework"
          checkIconPosition="right"
          searchable
          withAsterisk
          onChange={(value) => setTw(value)}
        />
        <TextInput
          placeholder="กรอกชื่อผลงาน"
          label="ชื่อผลงาน"
          name="wname"
          onChange={(event) => setWname(event.target.value)}
        />
        {/* <Input.Wrapper label="ไฟล์">
          <Input
            placeholder="เลือกไฟล์"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Input.Wrapper> */}
        <FileInput
          label="ไฟล์ผลงาน"
          multiple
          value={File}
          onChange={HandleFile}
          leftSection={<IconFilePlus />}
          placeholder="เลือกไฟล์"
          leftSectionPointerEvents="none"
          clearable
        />
        {Array.isArray(pv) && (
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <Carousel height="auto">
              {pv.map((i) => (
                <Carousel.Slide>
                  <Image src={i} />
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        )}
        <Button fullWidth mt="md" color="#3366FF" onClick={handleAddWork}>
          {/* <Button fullWidth mt="md" color="#3366FF" onClick={uploadImage}> */}
          บันทึกข้อมูล
        </Button>
      </Modal>

      <Modal
        opened={viewModal}
        onClose={() => {
          setViewModal(false);
          setSelectIMG([]);
        }}
        title={`${SelectIMG[0]?.wtname} - ${SelectIMG[0]?.stdid} ${SelectIMG[0]?.stdname}`}
        scrollAreaComponent={ScrollArea.Autosize}
        size="50%"
        centered
      >
        <Carousel
          withIndicators
          height={500}
          slideSize={{ base: "100%", sm: "100%", md: "33.333333%" }}
          slideGap={{ base: 0, sm: "md" }}
          loop
          align="center"
        >
          {SelectIMG.map((img) => (
            <Carousel.Slide>
              <Image
                src={`http://localhost:9999/pic/${img.pathwork}`}
                height="70%"
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Modal>
    </div>
  );
}

export default Work;
