import {
  AppShell,
  Burger,
  Flex,
  Group,
  NavLink,
  Skeleton,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, NavLink as Nl } from "react-router-dom";
import {
  IconFolderHeart,
  IconUser,
  IconCategory,
  IconPlus,
} from "@tabler/icons-react";
// import { MantineLogo } from "@mantinex/mantine-logo";

function Layout() {
  const [Active, setActive] = useState(0);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const data = [
    {
      title: "นักศึกษา",
      path: "/student",
      icon: <IconUser />,
      sub: [
        {
          title: "เพิ่มข้อมูลนักศึกษา",
          icon: <IconPlus />,
        },
      ],
    },
    {
      title: "ผลงาน",
      path: "/work",
      icon: <IconFolderHeart />,
    },
    {
      title: "ประเภทผลงาน",
      path: "/worktype",
      icon: <IconCategory />,
    },
  ];
  useEffect(() => {
    const index = data.findIndex(
      (val) => val.path === window.location.pathname
    );
    console.log(index);
    setActive(index);
  }, []);
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 270,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      // padding="md"
    >
      <AppShell.Header
        style={{
          borderBottom: "0",
          background: "#3366FF",
          color: "#FFF",
        }}
      >
        <Group h="100%" px="md">
          ด.ช.นาวิน รื่นรวย
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
            color="#FFF"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
            color="#FFF"
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" style={{ borderRight: "0" }}>
        <Flex direction={"column"} align={"center"}>
          {data.map((i, key) => (
            <NavLink
              color="#3366FF"
              style={{
                borderRadius: "10px",
                padding: "15px 15px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
              onClick={() => {
                // toggle();
                setActive(key);
              }}
              active={key === Active}
              component={Nl}
              to={i.path}
              label={i.title}
              leftSection={i.icon}
            />
          ))}
        </Flex>
      </AppShell.Navbar>
      <AppShell.Main style={{ background: "#f0f2f8" }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
