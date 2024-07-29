export const base_config = {
  sentry: {
    active: true,
  },
  gtag: {
    active: true,
  },
  idle: {
    active: true,
    times: {
      session: 900,
      alert: 180,
    },
  },
  spinner_loading: {
    light: {
      bdColor: 'rgba(255,255,255,0.5)',
      color: '#106eea',
    },
    dark: {
      bdColor: '#2a323dad',
      color: '#106eea',
    },
  },
  reports: {
    types: {
      pdf: 'application/pdf',
      xls: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      doc: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
  },
  system: {
    name: 'Universidad de Valparaíso',
    token: true,
    breadcrumb: true,
    replaceState: true,
    isDevelop: false, //only token = false;
    isMaintenance: false, //only token = false;
    url: {
      portal: 'https://portal.uv.cl',
      cambiaclave: 'https://cambiaclave.uv.cl',
      repositorio: 'https://repositorio.uv.cl',
      manual: 'https://repositorio.uv.cl/static/testing.pdf',
      logouv: {
        main_loading: {
          light: 'https://repositorio.uv.cl/imagenes/logouv/svg/uv_azul.svg',
          dark: 'https://repositorio.uv.cl/imagenes/logouv/svg/uv_blanco.svg',
        },
        uv: {
          light: 'https://repositorio.uv.cl/imagenes/logouv/svg/uv_azul.svg',
          dark: 'https://repositorio.uv.cl/imagenes/logouv/svg/uv_blanco.svg',
        },
        acreditacion: {
          light:
            'https://repositorio.uv.cl/imagenes/logouv/svg/acreditacion_azul.svg',
          dark: 'https://repositorio.uv.cl/imagenes/logouv/svg/acreditacion_blanco.svg',
        },
        uv_acreditacion: {
          dark: 'https://repositorio.uv.cl/imagenes/logouv/svg/uv_acreditacion_blanco.svg',
          light:
            'https://repositorio.uv.cl/imagenes/logouv/svg/uv_acreditacion_azul.svg',
        },
        no_icon:
          'https://repositorio.uv.cl/imagenes/iconos_sistemas/menus/base/noicon.png',
      },
    },
    icons: {
      home: 'pi pi-home',
      develop: 'pi pi-code',
      develop_page: 'fa-solid fa-trowel-bricks',
      maintenance: 'pi pi-cog',
      maintenance_page: 'fa-solid fa-screwdriver-wrench',
      error_page: 'fa-regular fa-times-circle',
      portal: 'fa-solid fa-building-columns',
      ayuda: 'pi pi-question-circle',
      sistemas: 'pi pi-th-large',
      avisos: 'pi pi-bell',
      contacto: 'pi pi-comments',
      simbologia: 'fa-solid fa-icons',
      manual: 'fa-solid fa-book-open-reader',
      profile: 'pi pi-user',
      correo: 'pi pi-envelope',
      cambiaclave: 'pi pi-key',
      logout: 'pi pi-sign-out',
      login: 'pi pi-sign-in',
      translate: 'pi pi-language',
      modulos: 'pi pi-desktop',
      aplicaciones: 'pi pi-globe',
      menus: 'pi pi-bars',
      sesion_page: 'fa-solid fa-user-clock',
      theme: 'fa-solid fa-universal-access',
    },
    theme: {
      active: true,
      themes: {
        values: ['light', 'dark'],
        default: 'light',
      },
      fontSize: {
        min: 12,
        max: 20,
        default: 16,
      },
      translate: {
        active: false,
        langs: [
          { lang: 'Español', code: 'es' },
          { lang: 'English', code: 'en' },
        ],
        default: 'es',
      },
    },
    path: {
      aplicaciones: '/imagenes/iconos_sistemas/aplicaciones/',
      modulos: '/imagenes/iconos_sistemas/modulos/',
      static: '/static/sistemas/base/',
    },
    data: {
      aplicaciones: true,
      modulos: true,
      menus: true,
      avisos: true,
      usuario: true,
      startservices: true,
    },
    buttons: {
      home: true,
      theme: {
        active: true,
      },
      sistemas: {
        active: true,
        children: {
          aplicaciones: true,
          modulos: true,
        },
      },
      menus: {
        active: true,
        metodo_active: '',
      },
      avisos: true,
      portal: true,
      ayuda: {
        active: true,
        children: {
          contacto: true,
          simbologia: true,
          manual: false,
        },
      },
      usuario: {
        active: true,
        children: {
          profile: true,
          correo: true,
          cambiaclave: true,
          logout: true,
        },
      },
    },
    mail: 'funcionario', // pregrado, postgrado, funcionario
    routing: {
      skipLocationChange: true,
    },
    backend: {
      timeout: 5000,
      retry: 1,
    },
  },
  mail_domains: {
    pregrado: 'http://correo.alumnos.uv.cl/',
    postgrado: 'http://correo.postgrado.uv.cl/',
    funcionario: 'http://correo.uv.cl/',
  },
  sites: {
    dtic: {
      name: 'Departamento de Tecnologías de Información y Comunicación',
      initials: 'DTIC',
      url: 'https://dtic.uv.cl',
      support: 'soporte@uv.cl',
    },
    uv: {
      name: 'Universidad de Valparaíso',
      initials: 'UV',
      url: 'https://uv.cl',
      rut: '60921000-1',
    },
    tui_uv: {
      name: 'Tarjera Universitaria Inteligente',
      initials: 'TUI UV',
      url: 'https://tui.uv.cl',
      server: 'https://admintui.uv.cl/data/fotos2/',
      format: 'jpg',
      default: 'https://admintui.uv.cl/data/fotos2/user_uv.jpg',
    },
  },
};
