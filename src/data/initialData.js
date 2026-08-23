export const initialTripData = {
  metadata: {
    title: "Nueva York · US Open 2026",
    travelers: "Lalo & Fefe",
    dates: "4 – 10 septiembre 2026",
    duration: "7 días · 2 personas",
    targetDate: "2026-09-04T07:10:00-05:00", // MEX time
    hotel: "Marriott Marquis Times Square (1535 Broadway)",
    hotelPhone: "+1 212-398-1900",
    flightOut: {
      airline: "United Airlines",
      flightNo: "UA MEX → EWR",
      departure: "07:10 MEX",
      arrival: "14:08 EWR",
      duration: "4h 58min",
      notes: "Vuelo directo. Desayunar antes de salir de casa."
    },
    flightReturn: {
      airline: "United Airlines",
      flightNo: "UA EWR → MEX",
      departure: "17:25 EWR",
      arrival: "20:45 MEX",
      duration: "5h 20min",
      notes: "Directo. Coordinar traslado al aeropuerto desde el hotel ~15:00."
    },
    pills: [
      "✈️ United MEX→EWR",
      "🏨 Marriott Marquis Times Sq",
      "🎾 4 sesiones Arthur Ashe",
      "🏔️ Hudson Valley",
      "🎟️ Go City Pass",
      "🍺 Cervezas · 🎷 Jazz · 🎸 Rock",
      "🥩 Katz's · 🍕 Joe's · 🍪 Levain"
    ]
  },

  urgentTasks: [
    {
      id: "task-1",
      priority: "green",
      text: "Traslado EWR confirmado",
      details: "Sports Traveler confirma llegada y salida desde EWR · chofer manda SMS al aterrizar · tel: +1-212-404-7491 · emergencias Chris Wetzel: 610-823-3838",
      completed: true,
      tag: "Traslado / Logística"
    },
    {
      id: "task-2",
      priority: "red",
      text: "Tickets US Open — Mobile Entry",
      details: "Aceptar tickets por email (link ACCEPT TICKETS) · descargar app \"2026 US Open Tennis\" · iniciar sesión con el mismo email · los tickets llegan 3-5 días antes del partido",
      completed: false,
      tag: "Tickets"
    },
    {
      id: "task-3",
      priority: "red",
      text: "Top of the Rock — reservar horario de atardecer",
      details: "totr.com · Reservar cuando abra disponibilidad para Sáb 5 sep, 17:30",
      completed: false,
      tag: "Reserva"
    },
    {
      id: "task-4",
      priority: "yellow",
      text: "Keens Steakhouse — reservar mesa",
      details: "keens.com · Mar 8, ~20:30, 2 personas · Solo aceptan Visa/MC (No Amex)",
      completed: false,
      tag: "Cena Especial"
    },
    {
      id: "task-5",
      priority: "yellow",
      text: "Village Vanguard o Smalls Jazz — reservar boletos",
      details: "villagevanguard.com o smallslive.com · Mar 8, set 10pm / 22:30",
      completed: false,
      tag: "Jazz"
    },
    {
      id: "task-6",
      priority: "yellow",
      text: "Birdland Jazz Club (opcional)",
      details: "birdlandjazz.com · Lun 7, set 9pm · 315 W 44th St",
      completed: false,
      tag: "Jazz"
    },
    {
      id: "task-7",
      priority: "yellow",
      text: "eSIM Holafly — activar antes del vuelo",
      details: "holafly.com · Activar datos ilimitados para USA antes de abordar",
      completed: false,
      tag: "Conectividad"
    },
    {
      id: "task-8",
      priority: "yellow",
      text: "Seguro de viajero",
      details: "Revisar si la tarjeta de crédito ya lo incluye; si no: iati.es o assistcard.com",
      completed: false,
      tag: "Seguro"
    },
    {
      id: "task-9",
      priority: "green",
      text: "Metro North (Hudson Valley) — comprar boletos",
      details: "App MTA TrainTime · Comprar el Mar 8 para el Miér 9 · Grand Central → Cold Spring ~8:00am",
      completed: false,
      tag: "Trenes"
    },
    {
      id: "task-10",
      priority: "cash",
      text: "Llevar suficiente efectivo (Cash Only spots)",
      details: "Joe's Pizza (~$5 slice), Corner Bistro, Bodegas, Flushing Chinatown Dim Sum, Brooklyn Flea",
      completed: false,
      tag: "Efectivo"
    }
  ],

  goCityPass: {
    title: "Go City Explorer Pass — 3 atracciones",
    subtitle: "El pase se activa con el primer uso · 30 días de vigencia · no elegir antes de llegar · llevar en la app",
    attractions: [
      {
        id: "gocity-1",
        name: "Intrepid Sea, Air & Space Museum",
        icon: "⚓",
        location: "Pier 86 (W 46th St & 12th Ave)",
        mapsUrl: "https://maps.google.com/?q=Intrepid+Museum+NYC",
        timeSuggested: "DÍA 2 · 10:00am",
        status: "Punto de Activación",
        desc: "Sin reserva previa. Presentar pase en taquilla. AQUÍ SE ACTIVA EL PASE.",
        duration: "2.5 horas",
        completed: false
      },
      {
        id: "gocity-2",
        name: "Top of the Rock",
        icon: "🏙️",
        location: "Rockefeller Center (30 Rockefeller Plaza)",
        mapsUrl: "https://maps.google.com/?q=Top+of+the+Rock+NYC",
        timeSuggested: "DÍA 2 · 17:30 (Atardecer)",
        status: "Requiere Reserva Previa",
        desc: "⚠️ Reservar hora en totr.com cuando abra disponibilidad. Elige 17:30 para ver atardecer con vista frontal al Empire State.",
        duration: "1.5 horas",
        completed: false
      },
      {
        id: "gocity-3",
        name: "MoMA — Museum of Modern Art",
        icon: "🎨",
        location: "11 W 53rd St (entre 5ta y 6ta Ave)",
        mapsUrl: "https://maps.google.com/?q=Museum+of+Modern+Art+NYC",
        timeSuggested: "DÍA 5 · 10:30am",
        status: "Llegar Temprano",
        desc: "Picasso, Warhol, Van Gogh ('Noche Estrellada'). Ir temprano para evitar filas. Verificar en la app si permite reserva de slot.",
        duration: "2 a 3 horas",
        completed: false
      }
    ]
  },

  sportsTravelerPackage: {
    hotel: "Marriott Marquis Times Square · 6 noches · Vie 4 – Jue 10 sep",
    sessions: [
      { session: "Sesión 15", name: "Round of 16 (Octavos) — Día", date: "Domingo 6 de septiembre", time: "11:00", stadium: "Arthur Ashe Stadium · Nivel 300 (Promenade), filas A-L" },
      { session: "Sesión 16", name: "Round of 16 (Octavos) — Noche", date: "Domingo 6 de septiembre", time: "19:00", stadium: "Arthur Ashe Stadium · Nivel 200 (Loge)" },
      { session: "Sesión 17", name: "Cuartos de Final — Día", date: "Lunes 7 de septiembre (Labor Day)", time: "11:00", stadium: "Arthur Ashe Stadium · Nivel 300 (Promenade), filas A-L" },
      { session: "Sesión 18", name: "Cuartos de Final — Noche", date: "Lunes 7 de septiembre (Labor Day)", time: "19:00", stadium: "Arthur Ashe Stadium · Nivel 200 (Loge)" }
    ],
    includes: [
      { id: "pkg-1", icon: "🎾", title: "Sesión 15 US Open", desc: "Dom 6 sep, mañana (Nivel 300, filas A-L) — Arthur Ashe" },
      { id: "pkg-2", icon: "🎾", title: "Sesión 16 US Open", desc: "Dom 6 sep, noche (Nivel 200, Loge) — Arthur Ashe" },
      { id: "pkg-3", icon: "🎾", title: "Sesión 17 US Open", desc: "Lun 7 sep, mañana (Nivel 300, filas A-L) — Arthur Ashe" },
      { id: "pkg-4", icon: "🎾", title: "Sesión 18 US Open", desc: "Lun 7 sep, 7:00pm (Nivel 200, Loge) — Arthur Ashe" },
      { id: "pkg-5", icon: "🚗", title: "Traslado Privado EWR", desc: "✅ Confirmado · chofer manda SMS al aterrizar · tel: +1-212-404-7491 · emergencias Chris Wetzel: 610-823-3838" },
      { id: "pkg-6", icon: "🚇", title: "Metro Ilimitado", desc: "Tarjeta / OMNY para transporte ilimitado toda la estancia" },
      { id: "pkg-7", icon: "🎟️", title: "Go City Explorer Pass", desc: "Pase digital para 3 atracciones principales" },
      { id: "pkg-8", icon: "🎁", title: "Regalo Oficial US Open", desc: "Kit de bienvenida oficial y guía de visitantes" }
    ]
  },

  days: [
    {
      dayNumber: 1,
      date: "Viernes 4 de septiembre",
      badge: "✈️ VUELO & LLEGADA",
      badgeColor: "blue",
      title: "Llegada · Primera cerveza en Hell's Kitchen · Times Square",
      summary: "Vuelo MEX→EWR, check-in en Marriott Marquis, primera pinta artesanal y cena relajada.",
      timeline: [
        {
          id: "d1-1",
          time: "07:10",
          title: "Despegue MEX · United Airlines",
          sub: "Vuelo directo UA · 4h 58min · Desayunar bien antes de salir de casa.",
          category: "logistics",
          status: "fijo", // Inamovible
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Aeropuerto+Internacional+de+la+Ciudad+de+Mexico",
          insiderTip: { icon: "⏰", text: "Llegar 2h antes por ser vuelo doméstico dentro de México — documentar equipaje y pasar control con tiempo." }
        },
        {
          id: "d1-2",
          time: "14:08",
          title: "Llegada EWR · esperar SMS del chofer",
          sub: "White Rose Transfers → Marriott Marquis Times Square · tel: +1-212-404-7491 · ✅ traslado confirmado.",
          category: "logistics",
          status: "fijo", // Inamovible
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Newark+Liberty+International+Airport",
          travelFromPrev: { icon: "✈️", text: "Sigues en el mismo vuelo UA MEX→EWR (4h 58min) hasta aterrizar en Newark." },
          insiderTip: { icon: "💡", text: "Sigan los letreros a \"Immigration\" — como turistas pasan con oficial (no hay quiosco automático), luego recogen maleta y salen por \"Ground Transportation\"." }
        },
        {
          id: "d1-3",
          time: "16:00",
          title: "Check-in Marriott Marquis — Eduardo Alva",
          sub: "1535 Broadway. Reserva confirmada y pre-pagada · recoger pases de metro y regalo de bienvenida en la recepción.",
          category: "logistics",
          status: "fijo", // Inamovible
          completed: false,
          mapsUrl: "https://maps.google.com/?q=New+York+Marriott+Marquis",
          travelFromPrev: { icon: "🚗", text: "Traslado privado White Rose Transfers desde EWR (~45-60 min por el Lincoln Tunnel, chofer ya confirmado)." },
          insiderTip: { icon: "💡", text: "Pidan piso alto al hacer check-in (a veces lo dan sin costo) y confirmen ahí mismo la hora de check-out del día 7." }
        },
        {
          id: "d1-4",
          time: "17:00",
          title: "Primer paseo por Times Square",
          sub: "Sentir la energía de Broadway, luces de neón y ambiente de la Gran Manzana.",
          category: "sights",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Times+Square+New+York",
          travelFromPrev: { icon: "🚶", text: "A pie: el hotel está en pleno Times Square (1 min, cruzando la puerta)." },
          insiderTip: { icon: "👀", text: "Los personajes disfrazados (Elmo, Minions, etc.) cobran por foto aunque no la pidan — mejor evitar el contacto si no quieren pagar." }
        },
        {
          id: "d1-5",
          time: "18:30",
          title: "🍺 Primera cerveza — Craft+Carry Hell's Kitchen",
          sub: "9na Ave entre 44th y 45th St. Gran selección de cervezas artesanales locales de NY, sampleo gratis (~1 hora).",
          category: "beer",
          status: "pendiente",
          completed: false,
          address: "665 9th Ave, New York, NY 10036",
          mapsUrl: "https://maps.google.com/?q=Craft+Carry+Hells+Kitchen+NYC",
          travelFromPrev: { icon: "🚶", text: "~12 min caminando hacia el oeste por la 44th St hasta la 9na Ave." },
          insiderTip: { icon: "🍺", text: "El sampleo es real: pidan una charola de shots (flight) antes de comprometerse a una pinta completa." }
        },
        {
          id: "d1-6",
          time: "20:00",
          title: "🍽️ Cena — Westway Diner (614 9na Ave)",
          sub: "Clásico neoyorquino 24hrs · sin reserva · hamburguesas, pasta, de todo · primer día sin complicaciones.",
          category: "food",
          status: "opcional", // Se puede cambiar o quitar
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Westway+Diner+9th+Ave+NYC",
          travelFromPrev: { icon: "🚶", text: "A pie, 1-2 cuadras sobre la misma 9na Ave (~3 min)." },
          insiderTip: { icon: "💡", text: "En diners clásicos puedes pedir refill de café gratis las veces que quieras — solo hay que levantar la taza." }
        }
      ],
      tips: [
        "Acostarse temprano: hay 2 horas de diferencia horaria adelante respecto a CDMX.",
        "Llevar chamarra ligera para la noche (~18°C) y powerbank siempre en la mochila."
      ],
      extraCards: [
        {
          title: "🎾 Tienda de Tenis — NYC Racquet Sports",
          icon: "🎾",
          items: [
            "<strong>NYC Racquet Sports (Herald Square)</strong> — a solo 10 min a pie del hotel.",
            "Pelotas oficiales Wilson US Open, raquetas de todas las marcas líderes, ropa técnica.",
            "Cuentan con programa de demo para probar raquetas antes de comprar."
          ]
        },
        {
          title: "⚾ Tiendas Oficiales Yankees",
          icon: "⚾",
          items: [
            "<strong>Yankees Clubhouse Shop (745 7th Ave, esq 49th St)</strong> — a 5 min del hotel. Jerseys, gorras 59FIFTY, memorabilia, bobbleheads. La más cercana al Marriott.",
            "<strong>Yankees Clubhouse Shop (110 E 59th St)</strong> — cerca de Apple Store y Rockefeller. Ideal para combinar el Día 2.",
            "<strong>Tour del Yankee Stadium (El Bronx)</strong> — 60 min, Monument Park + museo. ~25 min en metro (B, D o 4). NO queda de paso — requiere salida específica. Reservar en mlb.com/yankees/ballpark/tours."
          ]
        },
        {
          title: "🗽 Dónde comprar Souvenirs Auténticos",
          icon: "🗽",
          items: [
            "<strong>US Open Official Store (Días 3 y 4)</strong> — dentro del torneo Arthur Ashe. Ropa y accesorios exclusivos del torneo.",
            "<strong>Chelsea Market (Día 2)</strong> — diseñadores locales, productos artesanales, tote bags.",
            "<strong>Strand Bookstore (Día 2)</strong> — tote bags literarias icónicas, pins y prints.",
            "<strong>NY Transit Museum Shop (Grand Central)</strong> — llaveros y joyería hechos con auténticos tokens vintage del metro (1953–2003). ¡El souvenir más original!",
            "<strong>Brooklyn Flea en DUMBO (Día 7)</strong> — arte local y vintage auténtico.",
            "⚠️ <em>Evitar tiendas genéricas de Times Square: precios inflados y productos de baja calidad.</em>"
          ]
        }
      ]
    },

    {
      dayNumber: 2,
      date: "Sábado 5 de septiembre",
      badge: "🗽 DÍA LIBRE & CULTURA",
      badgeColor: "emerald",
      title: "Go City: Intrepid + Top of the Rock · High Line · Strand · Jazz",
      summary: "Activación de Go City en el Intrepid, paseo por el parque elevado High Line, compras en Strand, atardecer en Rockefeller y cena en Chelsea Market.",
      timeline: [
        {
          id: "d2-1",
          time: "07:45",
          title: "🥯 Desayuno rápido — Hell's Kitchenette Gourmet Deli",
          sub: "375 W 48th St (esq. 9na Ave). Deli de barrio bien calificado por su bacon, egg & cheese — pedirlo 'on a roll' y café regular (~$7 por persona). Alterna igual de cerca: Hell's Kitchen Deli, 535 9th Ave (~7 min más al sur). Entras, pides en el mostrador de la parrilla (no hay que sentarse) y pagas en caja — así funciona cualquier deli/bodega de Nueva York si luego quieres probar otra.",
          address: "375 W 48th St, New York, NY 10036",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Hell%27s+Kitchenette+Gourmet+Deli+375+W+48th+St+NYC",
          travelFromPrev: { icon: "🚶", text: "4 min caminando desde el hotel, cruzando Broadway hacia el oeste por la 48th St." },
          insiderTip: { icon: "💡", text: "El café \"regular\" de deli viene con leche y azúcar por default — si lo quieren negro, pidan \"black, no sugar\"." }
        },
        {
          id: "d2-1b",
          time: "08:00",
          title: "🥯 Desayuno alterno — Ess-a-Bagel (831 3rd Ave)",
          sub: "El bagel más famoso de NYC · pedir 'everything' con lox y cream cheese · abre temprano.",
          category: "food",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Ess-a-Bagel+3rd+Ave+NYC",
          travelFromPrev: { icon: "🚕", text: "Alterna a la bodega: taxi/metro cruzando a la 3rd Ave (~15 min) — luego hay que regresar al oeste para el Intrepid." },
          insiderTip: { icon: "⏰", text: "Se forma fila desde temprano; el bagel se pide tostado o no, y para llevar se dice \"to go\"." }
        },
        {
          id: "d2-2",
          time: "10:00",
          title: "⚓ Intrepid Sea, Air & Space Museum",
          sub: "Pier 86 (W 46th St & 12th Ave). 🎟️ Go City Pass se activa aquí (sin reserva). Portaaviones, Enterprise y Concorde (2.5h).",
          category: "culture",
          status: "fijo", // Activación Go City
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Intrepid+Museum+Pier+86+NYC",
          travelFromPrev: { icon: "🚶", text: "~18 min caminando hacia el río por la 46th St, o taxi/Uber corto (~7 min)." },
          insiderTip: { icon: "🎫", text: "Activen el Go City Pass mostrando el código QR de la app en taquilla — no hace falta imprimir nada." }
        },
        {
          id: "d2-3",
          time: "12:45",
          title: "🍺 Pausa cervecera — New York Beer Dispensary",
          sub: "637 10th Ave (a 3 min a pie del Intrepid). Descansar piernas con excelente cerveza de grifo local (~45 min).",
          category: "beer",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=New+York+Beer+Dispensary+10th+Ave",
          travelFromPrev: { icon: "🚶", text: "3 min caminando desde el Intrepid, mismo rumbo por la 10th Ave." },
          insiderTip: { icon: "🍺", text: "Es autoservicio: pagan por onza con una tarjeta prepago que recargan en la máquina y sirven ustedes mismos del grifo." }
        },
        {
          id: "d2-4",
          time: "14:00",
          title: "🌮 Almuerzo — Los Tacos No. 1 (Chelsea Market)",
          sub: "Los mejores tacos de la ciudad · sin reserva · económico y delicioso.",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Los+Tacos+No+1+Chelsea+Market",
          travelFromPrev: { icon: "🚇", text: "~10 min en metro (líneas A/C/E, 42 St → 14 St) + caminata corta, o ~30 min caminando hacia el sur." },
          insiderTip: { icon: "💡", text: "La fila se mueve rápido: pagan al ordenar y les dan un número, no hay mesero que atienda mesa." }
        },
        {
          id: "d2-5",
          time: "15:30",
          title: "🚶 The High Line — Parque Elevado",
          sub: "Caminar de norte (34th St / Hudson Yards) hacia el sur hasta Chelsea/Meatpacking. Gratis y espectacular.",
          category: "sights",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=The+High+Line+NYC",
          travelFromPrev: { icon: "🚇", text: "Subir de regreso al norte: metro 7 a Hudson Yards-34 St (~5 min), o 20 min caminando por la 10th Ave." },
          insiderTip: { icon: "👀", text: "Es un parque angosto elevado sobre vías de tren — pueden entrar y salir por cualquier escalera en cada cruce de calle." }
        },
        {
          id: "d2-6",
          time: "16:30",
          title: "📚 Strand Bookstore",
          sub: "828 Broadway (esq 12th St). 18 millas de libros. Buscar en sección de usados libros de economía, finanzas (CFA) y software.",
          category: "books",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Strand+Bookstore+828+Broadway",
          travelFromPrev: { icon: "🚶", text: "~14 min caminando al este, cruzando el Meatpacking District hasta Broadway." },
          insiderTip: { icon: "💡", text: "Los libros usados llevan el precio a lápiz en la primera página; el sótano tiene los más baratos y raros." }
        },
        {
          id: "d2-7",
          time: "17:30",
          title: "🏙️ Top of the Rock — Atardecer",
          sub: "Rockefeller Center. 🎟️ Go City Pass (⚠️ reservar hora a las 17:30 en totr.com). Vista frontal inigualable del Empire State.",
          category: "culture",
          status: "fijo", // Inamovible / Reserva
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Top+of+the+Rock+Observation+Deck",
          travelFromPrev: { icon: "🚇", text: "Metro desde Union Square (líneas N/Q/R/W, ~20 min) hasta 49 St-Rockefeller Center." },
          insiderTip: { icon: "⏰", text: "Lleguen 15 min antes de su hora reservada — si llegan tarde pueden perder el acceso a esa franja." }
        },
        {
          id: "d2-8",
          time: "19:00",
          title: "🍺 Pausa cervecera — Other Half Brewing Taproom",
          sub: "En Rockefeller Center. Las IPAs 'hazy' de culto más famosas de Nueva York (~45 min).",
          category: "beer",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Other+Half+Brewing+Rockefeller+Center",
          travelFromPrev: { icon: "🚶", text: "En el mismo Rockefeller Center, unos pasos desde la salida del mirador." },
          insiderTip: { icon: "🍺", text: "Pidan el flight de 4 muestras para probar variedad sin comprometerse a una pinta completa." }
        },
        {
          id: "d2-9",
          time: "20:00",
          title: "🍱 Cena — Chelsea Market",
          sub: "Los Tacos No. 1, Cull & Pistol (ostras/mariscos) y postre: Mango Sticky Rice de Ayada Thai 🥭.",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Chelsea+Market+NYC",
          travelFromPrev: { icon: "🚇", text: "Metro línea 1 (50 St → 14 St, ~15 min) de regreso a Chelsea Market." },
          insiderTip: { icon: "💡", text: "Es un mercado de puestos independientes: pueden comprar en varios y sentarse donde quieran, sin quedarse fijos en uno." }
        },
        {
          id: "d2-10",
          time: "22:00",
          title: "🎷 Jazz opcional — 55 Bar",
          sub: "55 Christopher St, Greenwich Village. Bar histórico de jazz/blues desde 1919 con cover mínimo (si tienen energía).",
          category: "music",
          status: "opcional", // Muy opcional
          completed: false,
          mapsUrl: "https://maps.google.com/?q=55+Bar+Christopher+St+NYC",
          travelFromPrev: { icon: "🚶", text: "~15 min caminando hacia el sur, o una parada más en la línea 1 hasta Christopher St." },
          insiderTip: { icon: "💵", text: "El cover se paga en efectivo directo en la puerta, no hay opción de pagarlo en línea antes." }
        }
      ],
      tips: [
        "Usar tenis súper cómodos: se caminan fácil más de 18,000 pasos.",
        "Llevar chamarra para la terraza del Top of the Rock (el viento a esa altura refresca bastante).",
        "Tener el iPhone bien cargado y powerbank listo para fotos del atardecer.",
        "Qué es una 'bodega': la tienda de la esquina abierta 24/7 con mostrador y parrilla al fondo. No hay que sentarse — pides directo al cocinero ('bacon, egg and cheese on a roll, please'), te lo envuelven en papel aluminio y pagas en la caja. Si Hell's Kitchenette está cerrada, cualquier bodega con parrilla visible en la 8va o 9na Ave sirve lo mismo."
      ],
      extraCards: [
        {
          title: "📚 Strand Bookstore — Wishlist de Libros",
          icon: "📚",
          items: [
            "<strong>CFA Curriculum 2025 Level I</strong> (edición usada, gran ahorro vs nuevo)",
            "<strong>Wiley's Level I CFA Exam Review</strong> (complemento práctico difícil de hallar en México)",
            "<strong>Options, Futures & Other Derivatives</strong> — John C. Hull (la biblia)",
            "<strong>When Genius Failed</strong> — Roger Lowenstein (colapso de LTCM, ritmo novelesco)",
            "<strong>The Alchemy of Finance</strong> — George Soros (cómo opera y piensa los mercados)",
            "<strong>A Philosophy of Software Design</strong> — John Ousterhout (diseño de sistemas)",
            "<strong>Staff Engineer</strong> — Will Larson (liderazgo técnico avanzado)",
            "<strong>Mastering Bitcoin</strong> — Andreas Antonopoulos (perspectiva cripto y mining)",
            "<strong>The Bitcoin Standard</strong> — Saifedean Ammous (fundamentos monetarios)",
            "<strong>Quantum Computing: An Applied Approach</strong> — Jack Hidary (Python + Qiskit)",
            "⚠️ <em>Cava y Marc Vidal solo publican en español — no se consiguen en NYC.</em>"
          ]
        },
        {
          title: "🥞 Desayuno Famoso Alternativo",
          icon: "🥞",
          items: [
            "<strong>Clinton Street Baking Company (4 Clinton St, LES)</strong> — elegidas 2 veces las mejores pancakes de NYC por New York Magazine.",
            "Pedir las <em>Wild Maine Blueberry Pancakes</em> con salsa de mantequilla de maple tibia.",
            "Abre 8:30am; queda cerca de Katz's Delicatessen (ideal también para el Día 7)."
          ]
        },
        {
          title: "👀 Puntos Clave en The High Line",
          icon: "👀",
          items: [
            "Arte e instalaciones públicas contemporáneas a lo largo de las vías.",
            "El edificio <strong>Standard High Line Hotel</strong> que cruza en voladizo sobre el parque.",
            "Vistas abiertas al río Hudson y New Jersey al oeste.",
            "Desemboca en el <strong>Meatpacking District</strong> con calles adoquinadas del siglo XIX."
          ]
        },
        {
          title: "🍎 Apple Store 5ta Avenida",
          icon: "🍎",
          items: [
            "<strong>Apple Fifth Avenue (767 5th Ave)</strong> — el icónico cubo de vidrio subterráneo abierto 24/7.",
            "Excelente para accesorios MagSafe, correas de Apple Watch o AirTags.",
            "<em>Nota: las Mac y iPads tienen precios similares y garantías con particularidades locales.</em>"
          ]
        },
        {
          title: "🎾 Vanderbilt Tennis Club — Grand Central Terminal",
          icon: "🎾",
          items: [
            "<strong>El club de tenis más exclusivo de Manhattan</strong> — escondido en el piso 4 de Grand Central. Courts indoor de hard court, abierto al público sin membresía.",
            "<strong>Cómo llegar:</strong> Entrar por 'The Campbell Bar' (toldo rojo en Vanderbilt Ave entre 42nd y 43rd) → elevadores al 4to piso.",
            "<strong>Reservar cancha:</strong> vanderbilttennisclub.com · tel: (212) 599-6500 · 1 cancha regulation + 2 practice courts.",
            "<strong>Cuándo ir:</strong> Día 6 (miércoles) — Grand Central es el punto de salida al tren del Hudson Valley, ideal verlo antes de tomar el Metro North."
          ]
        }
      ]
    },

    {
      dayNumber: 3,
      date: "Domingo 6 de septiembre",
      badge: "🎾 US OPEN · DÍA 1",
      badgeColor: "amber",
      title: "US Open Sesiones 15 & 16 · Arthur Ashe · Honey Deuce",
      summary: "Día completo de tenis de clase mundial en Flushing Meadows: Round of 16 día y noche en Arthur Ashe Stadium, cocktail Honey Deuce y recorrido por canchas secundarias.",
      timeline: [
        {
          id: "d3-1",
          time: "07:30",
          title: "🍳 Desayuno — Tick Tock Diner (481 8th Ave)",
          sub: "Diner clásico 24hrs a 5 min del hotel · huevos, pancakes, café · comer bien antes del día largo.",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Tick+Tock+Diner+8th+Ave+NYC",
          travelFromPrev: { icon: "🚶", text: "5 min a pie desde el hotel." },
          insiderTip: { icon: "💡", text: "Si van con prisa, pidan la cuenta desde que los sientan — en diners no la traen sola al terminar." }
        },
        {
          id: "d3-2",
          time: "09:00",
          title: "🚇 Metro Línea 7 Express → Flushing",
          sub: "Hotel (7a Ave y 45th) → caminar 3 bloques → Times Sq-42 St Station → Línea 7 → Mets-Willets Point (17 paradas, ~35 min).",
          category: "logistics",
          status: "fijo", // Inamovible
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Mets-Willets+Point+Station",
          travelFromPrev: { icon: "🚶", text: "~10 min caminando de regreso a Times Sq-42 St para tomar la Línea 7." },
          insiderTip: { icon: "💡", text: "Busquen el letrero verde \"Express\" en el andén: el 7 Express salta paradas y llega más rápido a Flushing." }
        },
        {
          id: "d3-2b",
          time: "09:30",
          title: "Se abren las puertas — Arthur Ashe Stadium",
          sub: "Llegar temprano para evitar filas en el screening de seguridad.",
          category: "logistics",
          status: "fijo",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Arthur+Ashe+Stadium",
          travelFromPrev: { icon: "🚶", text: "Bajar en Mets-Willets Point y cruzar el puente peatonal hacia la entrada de seguridad (~10 min)." },
          insiderTip: { icon: "🎫", text: "La revisión es como en aeropuerto: detector de metal y bolsa transparente — saquen objetos metálicos antes de llegar a la fila." }
        },
        {
          id: "d3-3",
          time: "11:00",
          title: "🎾 Sesión 15 — Arthur Ashe Stadium (Día)",
          sub: "Nivel 300, filas A-L. Round of 16 (Octavos de final). Partidos electrizantes.",
          category: "tennis",
          status: "fijo", // Inamovible / Boletos
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Arthur+Ashe+Stadium",
          travelFromPrev: { icon: "🚶", text: "Ya dentro del complejo: caminar a tu entrada asignada en Arthur Ashe (Nivel 300)." },
          insiderTip: { icon: "🎫", text: "El boleto mobile solo se activa 1-2 horas antes del partido en la app — ábranlo antes de llegar a la entrada." }
        },
        {
          id: "d3-4",
          time: "13:30",
          title: "🍸 Honey Deuce — Trago Oficial Obligatorio",
          sub: "Vodka Grey Goose + licor de frambuesa Chambord + limonada fresca + 3 bolitas de melón honeydew ($25 USD). ¡El vaso coleccionable con los campeones es el souvenir!",
          category: "beer",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=USTA+Billie+Jean+King+National+Tennis+Center",
          travelFromPrev: { icon: "🚶", text: "A la salida de tu sección, los bares de Honey Deuce están en los pasillos del mismo estadio." },
          insiderTip: { icon: "💵", text: "Se compra en cualquier bar de concesiones del estadio, sin fila especial — guarden el vaso, es coleccionable." }
        },
        {
          id: "d3-5",
          time: "14:00",
          title: "🎾 Canchas secundarias + Food Courts",
          sub: "Explorar canchas exteriores (Grandstand, Court 17), ver entrenamientos de estrellas de cerca y comer en los puestos del complejo.",
          category: "tennis",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=USTA+National+Tennis+Center+Food+Village",
          travelFromPrev: { icon: "🚶", text: "Caminar por los jardines del complejo hacia las canchas exteriores (~10 min)." },
          insiderTip: { icon: "👀", text: "Las canchas exteriores son de entrada libre con su boleto del día — pueden entrar y salir sin boleto extra." }
        },
        {
          id: "d3-6",
          time: "19:00",
          title: "🎾 Sesión 16 — Arthur Ashe Stadium (Noche)",
          sub: "Nivel 200, Loge (asientos premium más cercanos). La atmósfera nocturna de Arthur Ashe es la más vibrante de todo el tenis mundial.",
          category: "tennis",
          status: "fijo", // Inamovible / Boletos
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Arthur+Ashe+Stadium",
          travelFromPrev: { icon: "🚶", text: "Regresar a Arthur Ashe Stadium, entrada Nivel 200 (Loge)." },
          insiderTip: { icon: "💡", text: "De noche baja la temperatura rápido — lleven la chamarra aunque salgan con calor de la tarde." }
        },
        {
          id: "d3-7",
          time: "22:30",
          title: "🚇 Regreso en Metro Línea 7 al hotel",
          sub: "34 St-Hudson Yards → bajar en Times Sq-42 St (19 paradas) → caminar 3 bloques a 45th.",
          category: "logistics",
          status: "fijo",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=New+York+Marriott+Marquis",
          travelFromPrev: { icon: "🚶", text: "Salir con la multitud hacia Mets-Willets Point y tomar la Línea 7 de regreso." },
          insiderTip: { icon: "⏰", text: "Salgan con calma: miles de personas salen a la vez y el andén puede tardar 10-15 min extra en despejarse." }
        }
      ],
      tips: [
        "Tickets: Mobile Entry únicamente vía app \"2026 US Open Tennis\" — aceptar por email antes de llegar.",
        "Bolsa: UNA por persona, máximo 12\"W × 12\"H × 16\"L. Sin mochila (solo drawstring bag de un compartimento).",
        "Prohibido: laptops, drones, selfie sticks, raquetas, alcohol, cámaras de video, latas, botellas de vidrio.",
        "Permitido: botella reutilizable de agua ≤24 oz (metal o plástico), celular, cámara SLR sin video dedicado.",
        "Lentes de sol oscuros + protector solar SPF 50 para la sesión diurna. Chamarra para la nocturna (~15°C).",
        "Llegar temprano: hay screening de seguridad en todas las puertas, puede haber fila."
      ],
      extraCards: [
        {
          title: "🎾 Guía Rápida Arthur Ashe Stadium",
          icon: "🎾",
          items: [
            "<strong>Sesión 15 (Día):</strong> Nivel 300 (Promenade) filas A-L — excelente visión panorámica de la táctica.",
            "<strong>Sesión 16 (Noche):</strong> Nivel 200 (Loge) — gran cercanía al court, energía inigualable.",
            "<strong>Tienda oficial:</strong> Entrar entre partidos para comprar gorras y polos oficiales antes de que se agoten tallas."
          ]
        }
      ]
    },

    {
      dayNumber: 4,
      date: "Lunes 7 de septiembre (Labor Day)",
      badge: "🎾 US OPEN · DÍA 2",
      badgeColor: "amber",
      title: "US Open Sesiones 17 & 18 · Dim Sum en Flushing · Birdland / Rock",
      summary: "Labor Day con tenis estelar (Cuartos de final), escapada culinaria a Flushing Chinatown para dim sum auténtico y noche de música en vivo en Manhattan.",
      timeline: [
        {
          id: "d4-1",
          time: "08:30",
          title: "🥑 Desayuno — Little Collins (667 Lexington Ave)",
          sub: "Australiano, favorito de locales · pedir el Green Eggs & Damn (omelette de espinaca con queso de cabra) · puede haber fila corta.",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Little+Collins+Lexington+Ave+NYC",
          travelFromPrev: { icon: "🚇", text: "Metro E/M o taxi corto desde el hotel (~10 min) hasta Lexington Ave." },
          insiderTip: { icon: "💡", text: "Es australiano de verdad: el \"flat white\" es más fuerte y con menos espuma que un latte normal." }
        },
        {
          id: "d4-2",
          time: "09:00",
          title: "🚇 Metro Línea 7 Express → Flushing",
          sub: "Hacia Mets-Willets Point · puertas de Arthur Ashe abren 9:30am.",
          category: "logistics",
          status: "fijo",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Mets-Willets+Point",
          travelFromPrev: { icon: "🚇", text: "Caminar a Grand Central-42 St (~8 min) y tomar la Línea 7 Express hacia Flushing." },
          insiderTip: { icon: "💡", text: "Mismo truco de ayer: busquen el letrero \"Express\" en el andén para no parar en cada estación." }
        },
        {
          id: "d4-3",
          time: "11:00",
          title: "🎾 Sesión 17 — Arthur Ashe Stadium (Día)",
          sub: "Nivel 300, filas A-L. Cuartos de final: tenis de máxima intensidad.",
          category: "tennis",
          status: "fijo", // Inamovible
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Arthur+Ashe+Stadium",
          travelFromPrev: { icon: "🚶", text: "Directo del andén a tu entrada asignada en Arthur Ashe (Nivel 300)." },
          insiderTip: { icon: "⏰", text: "Día festivo (Labor Day) = más gente — lleguen con margen extra para el filtro de seguridad." }
        },
        {
          id: "d4-4",
          time: "14:00",
          title: "🥟 Flushing Chinatown — Dim Sum Auténtico",
          sub: "A solo 1 parada de metro en Flushing-Main St. Golden Mall (sótano) o puestos de dumplings callejeros. Baratísimo, hiper auténtico. (Llevar efectivo 💵).",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Golden+Mall+Flushing+NY",
          travelFromPrev: { icon: "🚇", text: "Una parada de metro en la Línea 7 (Mets-Willets Point → Flushing-Main St, ~5 min)." },
          insiderTip: { icon: "💵", text: "El Golden Mall es un sótano de puestos chiquitos — señalar el platillo con el dedo si no saben el nombre funciona perfecto." }
        },
        {
          id: "d4-5",
          time: "15:15",
          title: "🍺 Cerveza fría con el Dim Sum",
          sub: "Tsingtao helada o Sapporo con los dumplings (~$5-6 USD).",
          category: "beer",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Flushing+Main+St+Queens",
          travelFromPrev: { icon: "📍", text: "Mismo lugar: pedir la cerveza junto con los dumplings." },
          insiderTip: { icon: "🍺", text: "Muchos puestos no tienen licencia de alcohol — cómprenla en la tienda de junto y llévenla a la mesa." }
        },
        {
          id: "d4-6",
          time: "19:00",
          title: "🎾 Sesión 18 — Arthur Ashe Stadium (Noche)",
          sub: "Nivel 200, Loge · puertas abren 18:00 · Cuartos de final, sesión nocturna · ticket mobile en US Open App.",
          category: "tennis",
          status: "fijo", // Inamovible
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Arthur+Ashe+Stadium",
          travelFromPrev: { icon: "🚇", text: "Línea 7 de regreso a Mets-Willets Point (~5 min) para la sesión nocturna." },
          insiderTip: { icon: "⏰", text: "Las puertas abren 18:00 para la sesión nocturna — no confundir con la hora del partido (19:00)." }
        },
        {
          id: "d4-7",
          time: "21:30",
          title: "🎷 Birdland Jazz Club — o — 🎸 The Red Lion",
          sub: "Opción Jazz: Birdland (315 W 44th St, birdlandjazz.com, a pasos del hotel). Opción Rock: The Red Lion (Bleecker St en Greenwich Village, bandas de rock en vivo).",
          category: "music",
          status: "opcional", // Opcional
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Birdland+Jazz+Club+NYC",
          travelFromPrev: { icon: "🚇", text: "Línea 7 Express de regreso a Times Square (~25-30 min); Birdland está a pasos de la estación." },
          insiderTip: { icon: "💵", text: "Birdland suele pedir consumo mínimo en mesa aparte del cover — pregunten el monto al reservar." }
        },
        {
          id: "d4-8",
          time: "22:30",
          title: "🚇 Regreso a Manhattan",
          sub: "Línea 7 express a Times Square.",
          category: "logistics",
          status: "fijo",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=New+York+Marriott+Marquis",
          travelFromPrev: { icon: "🚶", text: "Si fueron a Birdland ya están a 2 cuadras del hotel; si fueron a The Red Lion, línea 1/A/C/E hasta Times Square." },
          insiderTip: { icon: "💡", text: "La última corrida del 7 Express es tarde, pero después de medianoche puede volverse \"local\" (para en todas las estaciones)." }
        }
      ],
      tips: [
        "Efectivo obligatorio para Flushing: muchos de los mejores puestos de dumplings no reciben tarjeta.",
        "Código de vestimenta: casual pulcro si van a Birdland Jazz Club por la noche."
      ],
      extraCards: [
        {
          title: "🥟 Guía de Dim Sum en Flushing",
          icon: "🥟",
          items: [
            "Flushing es el Chinatown más auténtico y vibrante de toda la Costa Este.",
            "Platillos obligatorios: Xiao Long Bao (soup dumplings de cerdo), Roast Pork Buns (char siu bao), Pan-fried potstickers.",
            "Precios increíblemente accesibles ($10-15 USD por persona para un banquete)."
          ]
        }
      ]
    },

    {
      dayNumber: 5,
      date: "Martes 8 de septiembre",
      badge: "🏛️ CULTURA & GASTRONOMÍA",
      badgeColor: "purple",
      title: "MoMA · Wall Street · Memorial 9/11 · Keens · Jazz",
      summary: "El gran día gastronómico y cultural: obras maestras del MoMA, galleta en Levain, Wall Street y el Memorial 9/11, pizza de Spider-Man, Keens Steakhouse y jazz legendario.",
      timeline: [
        {
          id: "d5-1",
          time: "09:00",
          title: "🥐 Desayuno — Buvette (42 Grove St, West Village)",
          sub: "Bistró parisino íntimo · croque madame o waffle sandwich con mantequilla · ir entre semana para evitar fila.",
          category: "food",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Buvette+Grove+St+NYC",
          travelFromPrev: { icon: "🚇", text: "Metro línea 1 o A/C/E desde Times Sq-42 St hasta Christopher St-Sheridan Sq (~20 min) + 3 min a pie." },
          insiderTip: { icon: "💡", text: "Es diminuto: si no hay mesa, se puede comer parado en la barra — así lo hacen los locales." }
        },
        {
          id: "d5-2",
          time: "10:30",
          title: "🎨 MoMA — Museum of Modern Art",
          sub: "53rd St y 5ta Ave. 🎟️ Go City Pass. Van Gogh, Dalí, Warhol, Monet. Ir temprano para evitar multitudes (2-3h).",
          category: "culture",
          status: "fijo", // Pase Go City
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Museum+of+Modern+Art+NYC",
          travelFromPrev: { icon: "🚇", text: "Metro línea E/M desde West 4th St hasta 5th Ave-53 St (~20-25 min)." },
          insiderTip: { icon: "👀", text: "Descarguen el mapa del museo en la app antes de entrar — son 6 pisos y es fácil perderse buscando una sala." }
        },
        {
          id: "d5-3",
          time: "13:00",
          title: "🍺 Pausa en bar interior del MoMA / Jardín de esculturas",
          sub: "Descanso refrescante rodeado de esculturas de Rodin y Picasso.",
          category: "beer",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=The+Abby+Aldrich+Rockefeller+Sculpture+Garden",
          travelFromPrev: { icon: "🚶", text: "Dentro del mismo museo, en la planta baja." },
          insiderTip: { icon: "💡", text: "Entrada libre con el mismo boleto del museo, no necesitan boleto aparte para el jardín." }
        },
        {
          id: "d5-4",
          time: "13:30",
          title: "🍔 Almuerzo secreto — Burger Joint (Parker Hotel)",
          sub: "119 W 56th St. Escondida detrás de una cortina roja en el lobby del hotel. Cheeseburger legendaria y papas fritas.",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Burger+Joint+56th+St+NYC",
          travelFromPrev: { icon: "🚶", text: "~8 min caminando hacia el oeste por la 56th St." },
          insiderTip: { icon: "👀", text: "La entrada está literal detrás de una cortina roja en el lobby del hotel Le Parker Meridien — parece que no hay nada ahí." }
        },
        {
          id: "d5-5",
          time: "15:00",
          title: "🍪 Levain Bakery — Cookie 6oz Chocolate Chip Walnut",
          sub: "167 W 74th St (o sucursal Upper West). La galleta más famosa y decadente de Nueva York.",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Levain+Bakery+Upper+West+Side",
          travelFromPrev: { icon: "🚇", text: "Metro línea B/C o ~25 min caminando bordeando Central Park hacia el Upper West Side." },
          insiderTip: { icon: "⏰", text: "Puede haber fila en la calle — se mueve rápido, la venden solo para llevar." }
        },
        {
          id: "d5-6",
          time: "15:30",
          title: "🐂 Wall Street · Bajo Manhattan",
          sub: "Metro desde Midtown → Bowling Green. Charging Bull, Fearless Girl, NYSE, Trinity Church, Federal Hall — todo a pie (~1.5h tranquilas).",
          category: "sights",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Charging+Bull+Bowling+Green+NYC",
          travelFromPrev: { icon: "🚇", text: "Metro línea 2/3 Express desde 72 St hasta Wall St (~35-40 min) — el trayecto más largo del día." },
          insiderTip: { icon: "👀", text: "El Charging Bull siempre tiene fila para foto — el mejor ángulo con menos gente es desde atrás." }
        },
        {
          id: "d5-6b",
          time: "17:00",
          title: "🕊️ Memorial 9/11",
          sub: "Piscinas muy emotivas · paseo exterior (30-40 min) · a 5 min a pie de Wall Street.",
          category: "culture",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=911+Memorial+Pools+NYC",
          travelFromPrev: { icon: "🚶", text: "5 min a pie desde Wall Street/Bowling Green." },
          insiderTip: { icon: "💵", text: "Las piscinas conmemorativas son gratis; el museo interior sí cuesta y pide boleto aparte." }
        },
        {
          id: "d5-7",
          time: "18:00",
          title: "Regreso al hotel · Descanso y cambio de ropa",
          sub: "Metro desde Fulton St → Times Sq (~20 min) · descanso antes de la noche.",
          category: "logistics",
          status: "fijo",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=New+York+Marriott+Marquis",
          travelFromPrev: { icon: "🚇", text: "Metro línea 2/3 o A/C desde Fulton St hasta Times Sq (~20 min)." },
          insiderTip: { icon: "💡", text: "Aprovechen para cargar el celular durante el descanso — la noche todavía sigue larga." }
        },
        {
          id: "d5-8",
          time: "19:30",
          title: "🍕 Joe's Pizza — La pizza de Spider-Man 2",
          sub: "7 Carmine St, Greenwich Village (desde 1975). Rebanada de queso o pepperoni caliente (~$5, solo efectivo 💵).",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Joes+Pizza+7+Carmine+St+NYC",
          travelFromPrev: { icon: "🚇", text: "Metro línea 1 desde Times Sq hasta Christopher St (~15 min) + 2 min a pie." },
          insiderTip: { icon: "💵", text: "Solo efectivo, y se come parados en la banqueta doblando la rebanada por la mitad — así se come una pizza neoyorquina." }
        },
        {
          id: "d5-9",
          time: "20:00",
          title: "🥩 Cena Especial — Keens Steakhouse",
          sub: "72 W 36th St (desde 1885). El Mutton Chop legendario o Prime Porterhouse. Colección de pipas históricas. ⚠️ Solo Visa/MC, reservar con anticipación.",
          category: "food",
          status: "fijo", // Inamovible / Reserva
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Keens+Steakhouse+NYC",
          travelFromPrev: { icon: "🚕", text: "Taxi o Uber corto (~15 min); el metro exige transbordo y no vale la pena en ese tramo." },
          insiderTip: { icon: "⏰", text: "El Mutton Chop es gigante, para compartir entre dos; lleguen puntuales, la reserva se puede perder pasados 15 min." }
        },
        {
          id: "d5-10",
          time: "21:30",
          title: "🍌 Magnolia Bakery — Banana Pudding",
          sub: "401 Bleecker St, West Village. El postre clásico cremoso más alabado de la ciudad.",
          category: "food",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Magnolia+Bakery+Bleecker+St",
          travelFromPrev: { icon: "🚇", text: "Metro línea 1 desde 34 St-Penn Station hasta Christopher St (~20 min)." },
          insiderTip: { icon: "💡", text: "El Banana Pudding se pide en vasito individual — pidan tamaño \"small\" si no quieren el grande." }
        },
        {
          id: "d5-11",
          time: "22:30",
          title: "🎷 Jazz Legendario — Village Vanguard o Smalls",
          sub: "178 7th Ave S (Village Vanguard, el templo sagrado del jazz desde 1935) o Smalls Live en 183 W 10th St. Set de las 10:00pm/10:30pm.",
          category: "music",
          status: "fijo", // Reserva
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Village+Vanguard+NYC",
          travelFromPrev: { icon: "🚶", text: "5-8 min caminando; ambos clubes están a unas cuadras sobre la 7th Ave." },
          insiderTip: { icon: "💵", text: "Cover más consumo mínimo de una bebida en la entrada — llegar 20-30 min antes, se llena rápido." }
        }
      ],
      tips: [
        "Joe's Pizza: 100% solo efectivo. Comer de pie en la calle como auténtico neoyorquino.",
        "Keens Steakhouse: No aceptan American Express (solo Visa/MasterCard). Reservar con semanas de anticipación en keens.com.",
        "Corner Bistro (331 W 4th St): opción late-night, efectivo, abierto hasta las 4am — la mejor hamburguesa 'old school' de NYC si quieren cerrar la noche."
      ],
      extraCards: [
        {
          title: "👀 Qué ver en Central Park",
          icon: "👀",
          items: [
            "<strong>Bow Bridge:</strong> Puente romántico de hierro fundido de 1862.",
            "<strong>Bethesda Fountain:</strong> La estatua 'Angel of the Waters', vista en innumerables películas.",
            "<strong>Strawberry Fields:</strong> Mosaico 'Imagine' en homenaje a John Lennon, frente al edificio The Dakota.",
            "<strong>The Mall:</strong> Paseo flanqueado por centenarios olmos americanos."
          ]
        },
        {
          title: "🎥 Tech — B&H Photo Video",
          icon: "🎥",
          items: [
            "<strong>B&H Photo Video (9na Ave y 34th St):</strong> La tienda de fotografía y tecnología más impresionante del planeta — vale la pena una vuelta rápida."
          ]
        }
      ]
    },

    {
      dayNumber: 6,
      date: "Miércoles 9 de septiembre",
      badge: "🏔️ HUDSON VALLEY",
      badgeColor: "teal",
      title: "Escapada a Hudson Valley — Cold Spring & Beacon",
      summary: "Día de naturaleza y pueblos con encanto: tren panorámico por la orilla del río Hudson, antigüedades en Cold Spring, arte contemporáneo en Dia:Beacon y cerveza en Hudson Valley Brewery.",
      timeline: [
        {
          id: "d6-1",
          time: "08:00",
          title: "🚆 Tren Metro North desde Grand Central",
          sub: "Línea Hudson. Vista espectacular del río Hudson a la izquierda del tren (~75 min a Cold Spring). Comprar en app MTA TrainTime.",
          category: "logistics",
          status: "fijo",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Grand+Central+Terminal",
          travelFromPrev: { icon: "🚶", text: "15 min caminando hacia el este por la 42nd St, o metro shuttle S (Times Sq → Grand Central, 1 parada)." },
          insiderTip: { icon: "💵", text: "Compren el boleto en la app MTA TrainTime antes de subir — es más barato que comprarlo con el conductor en el tren." }
        },
        {
          id: "d6-2",
          time: "09:30",
          title: "☕ Desayuno en Cold Spring",
          sub: "Hudson Hil's Café o Brasserie Le Bouchon. Desayuno campestre delicioso en un pueblo histórico del siglo XIX.",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Hudson+Hils+Cafe+Cold+Spring",
          travelFromPrev: { icon: "🚶", text: "Bajar del tren y caminar 2-3 min al centro del pueblo." },
          insiderTip: { icon: "💡", text: "Pueblo chiquito, todo se camina — no necesitan Uber para nada dentro de Cold Spring." }
        },
        {
          id: "d6-3",
          time: "10:30",
          title: "🚶 Paseo por Main Street & Orilla del Río",
          sub: "Tiendas de antigüedades, librerías raras, galerías locales y muelle con vista a las Catskill Mountains.",
          category: "sights",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Main+St+Cold+Spring+NY",
          travelFromPrev: { icon: "🚶", text: "A pie, mismo Main Street." },
          insiderTip: { icon: "⏰", text: "Las tiendas de antigüedades cierran temprano entre semana (algunas a las 5pm) — revisen horario si algo les interesó." }
        },
        {
          id: "d6-4",
          time: "11:30",
          title: "🥾 Caminata ligera / Mirador Breakneck Ridge",
          sub: "Subida corta o sendero junto al río con aire puro y vistas panorámicas del valle del Hudson.",
          category: "sights",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Breakneck+Ridge+Trailhead",
          travelFromPrev: { icon: "🚕", text: "Taxi corto o ~30 min caminando por la orilla del río hacia el norte (Route 9D)." },
          insiderTip: { icon: "👀", text: "El sendero completo exige escalar con manos — si solo quieren la vista fácil, quédense en el primer mirador junto al río." }
        },
        {
          id: "d6-5",
          time: "13:00",
          title: "🍔 Almuerzo — The Foundry Café (Cold Spring)",
          sub: "Sándwiches artesanales, sopas del día y sidras locales.",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Foundry+Cafe+Cold+Spring",
          travelFromPrev: { icon: "🚶", text: "Regresar caminando o en taxi a Cold Spring (mismo trayecto en sentido contrario)." },
          insiderTip: { icon: "💵", text: "Pueblo pequeño: llevar efectivo siempre es bienvenido aunque acepten tarjeta." }
        },
        {
          id: "d6-6",
          time: "14:30",
          title: "🚆 Tren a Beacon (1 parada · 10 min)",
          sub: "Metro North corto de Cold Spring a Beacon.",
          category: "logistics",
          status: "fijo",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Beacon+Train+Station+NY",
          travelFromPrev: { icon: "🚶", text: "3 min a pie a la estación de Cold Spring." },
          insiderTip: { icon: "💡", text: "Revisen el andén correcto en la pantalla — Cold Spring y Beacon están en la misma línea pero en sentido opuesto a Manhattan." }
        },
        {
          id: "d6-7",
          time: "15:00",
          title: "🎨 Dia:Beacon (Museo de Arte Monumental)",
          sub: "Antigua fábrica de galletas Nabisco convertida en uno de los mejores museos de arte contemporáneo del mundo (esculturas gigantes de Richard Serra). A 10 min a pie de la estación.",
          category: "culture",
          status: "opcional", // Opcional
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Dia+Beacon+Museum",
          travelFromPrev: { icon: "🚶", text: "10 min caminando desde la estación de Beacon." },
          insiderTip: { icon: "🎫", text: "Compren el boleto en línea antes de llegar y se saltan la fila de taquilla." }
        },
        {
          id: "d6-8",
          time: "16:30",
          title: "🍺 Hudson Valley Brewery (Beacon)",
          sub: "7 E Main St, Beacon. Cervezas Sour IPAs mundialmente aclamadas en un taproom industrial relajado.",
          category: "beer",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Hudson+Valley+Brewery+Beacon+NY",
          travelFromPrev: { icon: "🚶", text: "10 min caminando de regreso hacia Main St." },
          insiderTip: { icon: "🍺", text: "Pidan el flight de 4-6 muestras — sus Sour IPA son intensas, mejor probar antes de pedir una pinta completa." }
        },
        {
          id: "d6-9",
          time: "18:00",
          title: "🚆 Tren de regreso a Grand Central (~90 min)",
          sub: "Ver el atardecer sobre el río Hudson desde la ventana del tren.",
          category: "logistics",
          status: "fijo",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Beacon+Station+to+Grand+Central",
          travelFromPrev: { icon: "🚶", text: "5 min a pie a la estación de Beacon." },
          insiderTip: { icon: "⏰", text: "Revisen el horario exacto en la app antes de salir del bar — los trenes de noche son menos frecuentes." }
        },
        {
          id: "d6-10",
          time: "20:00",
          title: "🍜 Cena — Jack's Wife Freda (50 Carmine St)",
          sub: "Mediterráneo-neoyorquino · shakshuka, waffles de rosewater, peri-peri chicken · ambiente relajado, sin reserva.",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Jacks+Wife+Freda+Carmine+St+NYC",
          travelFromPrev: { icon: "🚇", text: "Metro línea 1 o 6 desde Grand Central/Times Sq hasta Houston St (~20-25 min) tras dejar maletas en el hotel." },
          insiderTip: { icon: "💡", text: "Sin reserva, puede haber espera — dejan su nombre y avisan por mensaje de texto cuando hay mesa." }
        }
      ],
      tips: [
        "No hay estrés con horarios: los trenes de Metro North salen con frecuencia regular hacia Manhattan.",
        "Llevar chamarra ligera (la temperatura en el valle suele ser 3 a 5 grados menor que en Manhattan).",
        "Empacar maletas hoy por la noche para agilizar el check-out de mañana."
      ],
      extraCards: [
        {
          title: "👀 Qué ver en Cold Spring y Beacon",
          icon: "👀",
          items: [
            "<strong>Main St Cold Spring:</strong> Casas históricas del siglo XIX y tiendas de antigüedades auténticas.",
            "<strong>Riberas del Hudson:</strong> Vistas directas a West Point y Storm King Mountain.",
            "<strong>Dia:Beacon:</strong> Espacios de luz natural con obras gigantescas de Richard Serra, Donald Judd y Agnes Martin.",
            "<strong>Beacon Main Street:</strong> Murales, cafés de especialidad y ambiente artístico."
          ]
        }
      ]
    },

    {
      dayNumber: 7,
      date: "Jueves 10 de septiembre",
      badge: "✈️ DÍA DE REGRESO",
      badgeColor: "rose",
      title: "Russ & Daughters · Puente de Brooklyn · DUMBO · Katz's · Vuelo a MEX",
      summary: "Último día, salida temprano: desayuno judío en Russ & Daughters, caminata sobre el Brooklyn Bridge, foto en DUMBO, pastrami opcional en Katz's, check-out y vuelo de vuelta.",
      timeline: [
        {
          id: "d7-1",
          time: "07:00",
          title: "🥂 Desayuno — Russ & Daughters Cafe (127 Orchard St)",
          sub: "El desayuno judío histórico de NYC · salmón ahumado + bagel + cream cheese + latkes · más de 100 años · sin reserva, llegar temprano.",
          category: "food",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Russ+and+Daughters+Cafe+Orchard+St",
          travelFromPrev: { icon: "🚕", text: "Taxi/Uber directo desde el hotel (~15 min a esa hora, con poco tráfico)." },
          insiderTip: { icon: "💡", text: "Si van con prisa, es más rápido y barato pedir \"to go\" en la tienda de al lado (Appetizing) que sentarse en el café." }
        },
        {
          id: "d7-2",
          time: "07:45",
          title: "🌉 Brooklyn Bridge a pie — Manhattan → Brooklyn",
          sub: "La luz de la mañana en el puente es espectacular · sin multitudes (~30 min caminando).",
          category: "sights",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Brooklyn+Bridge+Pedestrian+Walkway",
          travelFromPrev: { icon: "🚶", text: "~15 min caminando al suroeste por Canal St/Centre St hasta la entrada del puente." },
          insiderTip: { icon: "👀", text: "Caminen por el carril peatonal elevado en el centro del puente — el carril de bicis va a los lados, cuidado al cruzar." }
        },
        {
          id: "d7-3",
          time: "08:30",
          title: "📸 DUMBO — foto del Manhattan Bridge",
          sub: "Washington St entre Front y Water · la foto más icónica de Brooklyn.",
          category: "sights",
          status: "pendiente",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=DUMBO+Brooklyn+Washington+St",
          travelFromPrev: { icon: "🚶", text: "Al final del puente, bajar hacia Washington St (~5 min)." },
          insiderTip: { icon: "👀", text: "El ángulo icónico es parados en medio de Washington St mirando al puente — esperen el hueco entre autos para la foto." }
        },
        {
          id: "d7-4",
          time: "09:15",
          title: "☕ Café en DUMBO · descanso breve",
          sub: "Brooklyn Roasting Company o cualquier café del barrio.",
          category: "food",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Brooklyn+Roasting+Company+DUMBO",
          travelFromPrev: { icon: "🚶", text: "A la vuelta de la esquina, en el mismo DUMBO." },
          insiderTip: { icon: "💡", text: "Aprovechen para sentarse un momento — viene una caminata/traslado largo después." }
        },
        {
          id: "d7-5",
          time: "09:45",
          title: "Uber o metro de regreso al hotel",
          sub: "~15-20 min de regreso a Times Square.",
          category: "logistics",
          status: "fijo",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=New+York+Marriott+Marquis",
          travelFromPrev: { icon: "🚕", text: "Uber (~20 min sin tráfico) o metro F hasta York St + transbordo, más lento." },
          insiderTip: { icon: "💡", text: "Pidan el Uber desde la app unos 10 min antes de salir del café para no esperar parados en la calle." }
        },
        {
          id: "d7-6",
          time: "10:30",
          title: "🥩 Katz's Delicatessen (opcional si hay tiempo)",
          sub: "205 E Houston St. ⚠️ NO perder el ticket de entrada. Pastrami 'juicy' cortado a mano ($28.95). Queda de paso al regresar de DUMBO.",
          category: "food",
          status: "opcional",
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Katzs+Delicatessen+205+E+Houston+St",
          travelFromPrev: { icon: "🚕", text: "De paso en el Uber/metro de regreso: bajar en el LES antes de seguir al hotel." },
          insiderTip: { icon: "💵", text: "No pierdan el ticket que les dan al entrar — sin él cobran una multa al salir aunque ya hayan pagado." }
        },
        {
          id: "d7-7",
          time: "11:00",
          title: "Check-out Marriott Marquis",
          sub: "El hotel puede guardar el equipaje · recogerlo antes de las 11:30.",
          category: "logistics",
          status: "fijo", // Inamovible
          completed: false,
          mapsUrl: "https://maps.google.com/?q=New+York+Marriott+Marquis",
          travelFromPrev: { icon: "🚕", text: "Uber o metro de regreso a Times Square (~15-20 min) para el check-out." },
          insiderTip: { icon: "💡", text: "El hotel guarda maletas gratis aunque ya hicieron check-out — pidan el ticket de resguardo." }
        },
        {
          id: "d7-8",
          time: "11:30",
          title: "🚗 Chofer frente al hotel → EWR",
          sub: "⚠️ Estar en el lobby 10 min antes · NO llegar tarde · White Rose Transfers · tel: +1-212-404-7491.",
          category: "logistics",
          status: "fijo", // Inamovible
          completed: false,
          mapsUrl: "https://maps.google.com/?q=New+York+Marriott+Marquis",
          travelFromPrev: { icon: "🚗", text: "El chofer recoge justo enfrente del lobby del hotel." },
          insiderTip: { icon: "💡", text: "Tengan el teléfono con volumen alto — el chofer avisa por SMS o llamada que ya está afuera." }
        },
        {
          id: "d7-9",
          time: "17:25",
          title: "✈️ Vuelo EWR → MEX · United Airlines",
          sub: "Vuelo directo UA · 5h 20min · Llegada estimada a CDMX: 20:45.",
          category: "logistics",
          status: "fijo", // Inamovible
          completed: false,
          mapsUrl: "https://maps.google.com/?q=Newark+Airport+Terminal+C",
          travelFromPrev: { icon: "✈️", text: "Traslado privado EWR (~40-50 min desde el hotel) directo a la terminal, documentar con tiempo." },
          insiderTip: { icon: "⏰", text: "Lleguen 3h antes por ser vuelo internacional — documentar y pasar TSA en Newark puede tardar más que en México." }
        }
      ],
      tips: [
        "Katz's: no perder el ticket · pedir pastrami \"juicy\" · efectivo o tarjeta.",
        "Brooklyn Flea: efectivo preferido si hay tiempo de pasar · vintage, antigüedades, arte local.",
        "Maletas listas desde la noche anterior · dejar espacio para libros de Strand y souvenirs.",
        "Coordinar traslado al aeropuerto con el hotel la noche del miércoles."
      ],
      extraCards: [
        {
          title: "🍽️ Comidas del día",
          icon: "🍽️",
          items: [
            "<strong>Desayuno:</strong> Russ & Daughters Cafe (127 Orchard St) — el desayuno judío más histórico de NYC · salmón ahumado + bagel + latkes · llegar 7am para evitar fila.",
            "<strong>Almuerzo:</strong> Katz's Deli (205 E Houston St) — pastrami 'juicy' · no perder el ticket al entrar · $28.95."
          ]
        },
        {
          title: "👀 Qué ver en Wall Street y Brooklyn Bridge",
          icon: "👀",
          items: [
            "<strong>Trinity Church:</strong> Iglesia anglicana de 1846 · cementerio donde está enterrado Alexander Hamilton.",
            "<strong>Federal Hall:</strong> Donde Washington tomó juramento como primer presidente, frente al NYSE.",
            "<strong>Charging Bull:</strong> Instalado ilegalmente en 1989 por el artista Arturo Di Modica · símbolo del optimismo de Wall Street.",
            "<strong>Fearless Girl:</strong> Instalada en 2017 frente al toro · símbolo de liderazgo femenino en finanzas.",
            "<strong>Brooklyn Bridge:</strong> Cables de acero, torres de granito y arcos góticos · ingeniería del siglo XIX todavía funcional · inaugurado en 1883.",
            "<strong>DUMBO Foto Icónica:</strong> Washington St entre Front y Water St, el Manhattan Bridge enmarcado en la calle."
          ]
        },
        {
          title: "🛍️ Merch Oficial Katz's Deli",
          icon: "🛍️",
          items: [
            "En la misma tienda venden camisetas clásicas 'Send a Salami to your Boy in the Army', delantales y gorras con el logo bordado desde 1888."
          ]
        }
      ]
    }
  ],

  recommendations: [
    {
      id: "rec-1",
      name: "Katz's Delicatessen",
      category: "food",
      subcategory: "Pastrami & Deli",
      zone: "Lower East Side",
      address: "205 E Houston St, New York, NY 10002",
      mapsUrl: "https://maps.google.com/?q=Katzs+Delicatessen+NYC",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Sándwich de Pastrami 'juicy' con mostaza deli + pepinillos kosher",
      tips: "¡No pierdas el ticket que te dan al entrar! Dale $1-2 de propina al cortador para que te dé a probar pastrami caliente recién rebanado.",
      daySuggested: 7,
      visited: false
    },
    {
      id: "rec-2",
      name: "Joe's Pizza (Original)",
      category: "food",
      subcategory: "Pizza Clásica",
      zone: "Greenwich Village",
      address: "7 Carmine St, New York, NY 10014",
      mapsUrl: "https://maps.google.com/?q=Joes+Pizza+7+Carmine+St",
      price: "$",
      paymentMethod: "cash_only",
      mustOrder: "Rebanada clásica de queso y rebanada de pepperoni crujiente (~$5)",
      tips: "Solo efectivo. Es la pizzería original que aparece en Spider-Man 2 (2004). Comer de pie como manda la tradición.",
      daySuggested: 5,
      visited: false
    },
    {
      id: "rec-3",
      name: "Keens Steakhouse",
      category: "food",
      subcategory: "Steakhouse Histórico",
      zone: "Midtown / Herald Square",
      address: "72 W 36th St, New York, NY 10018",
      mapsUrl: "https://maps.google.com/?q=Keens+Steakhouse+NYC",
      price: "$$$$",
      paymentMethod: "card_only",
      mustOrder: "Legendary Mutton Chop o Prime Porterhouse para dos + papas hashed brown",
      tips: "Abierto desde 1885 con la mayor colección de pipas de arcilla del mundo (Babe Ruth, Roosevelt). Solo aceptan Visa/MasterCard (No Amex). Reservar semanas antes.",
      daySuggested: 5,
      visited: false
    },
    {
      id: "rec-4",
      name: "Levain Bakery",
      category: "food",
      subcategory: "Cookies & Bakery",
      zone: "Upper West Side / NoHo",
      address: "167 W 74th St, New York, NY 10023",
      mapsUrl: "https://maps.google.com/?q=Levain+Bakery+W+74th+St",
      price: "$",
      paymentMethod: "both",
      mustOrder: "Chocolate Chip Walnut Cookie de 6 onzas (caliente y suave por dentro)",
      tips: "Son gigantescas (medio kilo entre dos galletas). Duran perfectas 3 días si compras para llevar.",
      daySuggested: 5,
      visited: false
    },
    {
      id: "rec-5",
      name: "Burger Joint",
      category: "food",
      subcategory: "Burgers Ocultas",
      zone: "Midtown",
      address: "119 W 56th St (Lobby del Parker Hotel)",
      mapsUrl: "https://maps.google.com/?q=Burger+Joint+Parker+Hotel",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Cheeseburger 'with the works' (lechuga, tomate, cebolla, pepinillo, mayonesa, mostaza)",
      tips: "Totalmente escondida detrás de una cortina gruesa de terciopelo café en el elegante lobby del hotel. Ambiente clandestino lleno de graffitis.",
      daySuggested: 5,
      visited: false
    },
    {
      id: "rec-6",
      name: "Clinton Street Baking Company",
      category: "food",
      subcategory: "Pancakes & Brunch",
      zone: "Lower East Side",
      address: "4 Clinton St, New York, NY 10002",
      mapsUrl: "https://maps.google.com/?q=Clinton+St+Baking+Company+NYC",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Wild Maine Blueberry Pancakes con jarabe de mantequilla de maple tibia casero",
      tips: "Votadas dos veces las mejores pancakes de Nueva York. Llegar antes de las 9:00am para evitar filas largas.",
      daySuggested: 2,
      visited: false
    },
    {
      id: "rec-7",
      name: "Corner Bistro",
      category: "food",
      subcategory: "Old School Tavern & Burger",
      zone: "West Village",
      address: "331 W 4th St, New York, NY 10014",
      mapsUrl: "https://maps.google.com/?q=Corner+Bistro+West+Village",
      price: "$",
      paymentMethod: "cash_only",
      mustOrder: "Bistro Burger (media libra con queso americano y tocino) + McSorley's Ale en tarro",
      tips: "Solo efectivo 💵. Taberna de madera auténtica abierta hasta las 4:00am. Cero pretensiones, puro sabor neoyorquino.",
      daySuggested: 5,
      visited: false
    },
    {
      id: "rec-8",
      name: "Golden Mall / Dim Sum en Flushing",
      category: "food",
      subcategory: "Dim Sum & Auténtico Chino",
      zone: "Flushing, Queens",
      address: "Main St & 41st Rd, Flushing, NY 11355",
      mapsUrl: "https://maps.google.com/?q=Golden+Mall+Flushing+Queens",
      price: "$",
      paymentMethod: "cash_only",
      mustOrder: "Xiao Long Bao (soup dumplings de cerdo), potstickers fritos, bao de cerdo asado",
      tips: "Solo efectivo 💵. A una parada de metro de Arthur Ashe. Es el barrio chino más auténtico de Nueva York.",
      daySuggested: 4,
      visited: false
    },
    {
      id: "rec-9",
      name: "Magnolia Bakery (Original)",
      category: "food",
      subcategory: "Postres",
      zone: "West Village",
      address: "401 Bleecker St, New York, NY 10014",
      mapsUrl: "https://maps.google.com/?q=Magnolia+Bakery+Bleecker+St",
      price: "$",
      paymentMethod: "both",
      mustOrder: "Classic Banana Pudding (en tamaño mediano o grande)",
      tips: "Sin necesidad de reservar. Comerlo sentado en las bancas de Bleecker St.",
      daySuggested: 5,
      visited: false
    },
    {
      id: "rec-10",
      name: "Craft+Carry Hell's Kitchen",
      category: "beer",
      subcategory: "Craft Beer Bar & Bottle Shop",
      zone: "Hell's Kitchen",
      address: "665 9th Ave, New York, NY 10036",
      mapsUrl: "https://maps.google.com/?q=Craft+Carry+Hells+Kitchen",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Pintas rotativas de microcervecerías del estado de NY (Grimm, Finback, SingleCut)",
      tips: "A 5 minutos a pie del Marriott Marquis. Te dan muestras gratis antes de elegir tu pinta.",
      daySuggested: 1,
      visited: false
    },
    {
      id: "rec-11",
      name: "Other Half Brewing Taproom",
      category: "beer",
      subcategory: "Hazy IPAs de Culto",
      zone: "Rockefeller Center",
      address: "600 5th Ave (esq 48th St), New York, NY 10020",
      mapsUrl: "https://maps.google.com/?q=Other+Half+Brewing+Rockefeller+Center",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Green Diamonds Double IPA o Forever Simcoe Hazy IPA",
      tips: "Considerada una de las mejores cervecerías artesanales del planeta. La sucursal en Rockefeller es comodísima.",
      daySuggested: 2,
      visited: false
    },
    {
      id: "rec-12",
      name: "Hudson Valley Brewery",
      category: "beer",
      subcategory: "Sour IPAs Innovadoras",
      zone: "Beacon (Hudson Valley)",
      address: "7 E Main St, Beacon, NY 12508",
      mapsUrl: "https://maps.google.com/?q=Hudson+Valley+Brewery+Beacon",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Sour IPA frutal o Hazy Pale Ale en su terraza industrial",
      tips: "Lugar de culto para geeks de la cerveza artesanal. Se llega caminando 15 min desde la estación de tren de Beacon.",
      daySuggested: 6,
      visited: false
    },
    {
      id: "rec-13",
      name: "Brooklyn Brewery Taproom",
      category: "beer",
      subcategory: "Pioneros Craft de NYC",
      zone: "Williamsburg, Brooklyn",
      address: "79 N 11th St, Brooklyn, NY 11249",
      mapsUrl: "https://maps.google.com/?q=Brooklyn+Brewery+Williamsburg",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Brooklyn Lager fresca de tanque, Defender IPA o Special Effects",
      tips: "Mesas comunales de picnic, ambiente joven y relajado en pleno corazón de Williamsburg.",
      daySuggested: 7,
      visited: false
    },
    {
      id: "rec-14",
      name: "Village Vanguard",
      category: "music",
      subcategory: "Templo Histórico del Jazz",
      zone: "West Village",
      address: "178 7th Ave S, New York, NY 10014",
      mapsUrl: "https://maps.google.com/?q=Village+Vanguard+NYC",
      price: "$$$",
      paymentMethod: "both",
      mustOrder: "Whisky o Martini clásico durante el set",
      tips: "El sótano sagrado del jazz desde 1935 (aquí grabaron Coltrane y Bill Evans). Reservar boletos con anticipación en villagevanguard.com para el set de las 10pm.",
      daySuggested: 5,
      visited: false
    },
    {
      id: "rec-15",
      name: "Birdland Jazz Club",
      category: "music",
      subcategory: "Jazz Club de Midtown",
      zone: "Hell's Kitchen",
      address: "315 W 44th St, New York, NY 10036",
      mapsUrl: "https://maps.google.com/?q=Birdland+Jazz+Club+NYC",
      price: "$$$",
      paymentMethod: "both",
      mustOrder: "Cócteles de autor y cena ligera",
      tips: "Bautizado en honor a Charlie 'Bird' Parker. Súper cerca del Marriott Marquis. Boletos en birdlandjazz.com.",
      daySuggested: 4,
      visited: false
    },
    {
      id: "rec-16",
      name: "The Red Lion",
      category: "music",
      subcategory: "Rock en Vivo & Pub",
      zone: "Greenwich Village",
      address: "151 Bleecker St, New York, NY 10012",
      mapsUrl: "https://maps.google.com/?q=The+Red+Lion+Bleecker+St",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Pintas de cerveza fría y alitas de pollo",
      tips: "Bandas de rock clásico y moderno en vivo los 7 días de la semana. Entrada accesible y ambiente muy animado.",
      daySuggested: 4,
      visited: false
    },
    {
      id: "rec-17",
      name: "Strand Bookstore",
      category: "books",
      subcategory: "Librería Legendaria (18 Millas)",
      zone: "Union Square / Greenwich Village",
      address: "828 Broadway, New York, NY 10003",
      mapsUrl: "https://maps.google.com/?q=Strand+Bookstore+NYC",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Tote bag icónica de Strand + libros técnicos/finanzas en sección usados",
      tips: "Terminales de búsqueda disponibles en los mostradores. La sección del sótano y 2do piso tienen libros descatalogados a excelente precio.",
      daySuggested: 2,
      visited: false
    },
    {
      id: "rec-18",
      name: "New York Transit Museum Gallery & Store",
      category: "shopping",
      subcategory: "Souvenirs Históricos Únicos",
      zone: "Midtown (Grand Central Terminal)",
      address: "Grand Central Terminal (Shuttle Passage)",
      mapsUrl: "https://maps.google.com/?q=New+York+Transit+Museum+Gallery+Grand+Central",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Mancuernillas, llaveros y joyería hechos con tokens de metro vintage (1953–2003)",
      tips: "El recuerdo más sofisticado y auténtico de la historia de la ciudad. Abierto todos los días dentro de Grand Central.",
      daySuggested: 6,
      visited: false
    },
    {
      id: "rec-19",
      name: "B&H Photo Video",
      category: "shopping",
      subcategory: "Megatienda de Fotografía y Gadgets",
      zone: "Midtown West",
      address: "420 9th Ave (esq 34th St), New York, NY 10001",
      mapsUrl: "https://maps.google.com/?q=BH+Photo+Video+NYC",
      price: "$$$",
      paymentMethod: "both",
      mustOrder: "Cámaras, accesorios y gadgets de foto/video",
      tips: "Fascinante sistema de rieles aéreos en el techo que transporta los pedidos hasta la caja. Cerrado los viernes en la tarde y sábados.",
      daySuggested: 5,
      visited: false
    },
    {
      id: "rec-20",
      name: "Dia:Beacon",
      category: "sights",
      subcategory: "Museo de Arte Contemporáneo",
      zone: "Beacon (Hudson Valley)",
      address: "3 Beekman St, Beacon, NY 12508",
      mapsUrl: "https://maps.google.com/?q=Dia+Beacon+Museum",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Salas monumentales de Richard Serra, Michael Heizer y Dan Flavin",
      tips: "A 10 minutos a pie de la estación de tren de Beacon. Luz cenital natural en una fábrica de los años 1920.",
      daySuggested: 6,
      visited: false
    },
    {
      id: "rec-21",
      name: "Ess-a-Bagel",
      category: "food",
      subcategory: "Bagels",
      zone: "Midtown East",
      address: "831 3rd Ave, New York, NY 10022",
      mapsUrl: "https://maps.google.com/?q=Ess-a-Bagel+3rd+Ave+NYC",
      price: "$",
      paymentMethod: "both",
      mustOrder: "Everything bagel con lox y cream cheese",
      tips: "El bagel más famoso de Nueva York. Abre temprano — ideal como desayuno alterno antes del Intrepid.",
      daySuggested: 2,
      visited: false
    },
    {
      id: "rec-22",
      name: "Tick Tock Diner",
      category: "food",
      subcategory: "Diner Clásico",
      zone: "Hell's Kitchen",
      address: "481 8th Ave, New York, NY 10001",
      mapsUrl: "https://maps.google.com/?q=Tick+Tock+Diner+8th+Ave+NYC",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Huevos, pancakes y café — desayuno completo antes de un día largo",
      tips: "Diner clásico 24hrs a 5 min del hotel. Ideal para cargar energía antes de la sesión de tenis.",
      daySuggested: 3,
      visited: false
    },
    {
      id: "rec-23",
      name: "Little Collins",
      category: "food",
      subcategory: "Café Australiano",
      zone: "Midtown East",
      address: "667 Lexington Ave, New York, NY 10022",
      mapsUrl: "https://maps.google.com/?q=Little+Collins+Lexington+Ave+NYC",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Green Eggs & Damn — omelette de espinaca con queso de cabra",
      tips: "Favorito de los locales. Puede haber fila corta, calcular tiempo antes de salir hacia Flushing.",
      daySuggested: 4,
      visited: false
    },
    {
      id: "rec-24",
      name: "Buvette",
      category: "food",
      subcategory: "Bistró Francés",
      zone: "West Village",
      address: "42 Grove St, New York, NY 10014",
      mapsUrl: "https://maps.google.com/?q=Buvette+Grove+St+NYC",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Croque madame o waffle sandwich con mantequilla",
      tips: "Bistró parisino íntimo con mucho encanto. Ir entre semana para evitar fila.",
      daySuggested: 5,
      visited: false
    },
    {
      id: "rec-25",
      name: "Jack's Wife Freda",
      category: "food",
      subcategory: "Mediterráneo-Neoyorquino",
      zone: "Greenwich Village",
      address: "50 Carmine St, New York, NY 10014",
      mapsUrl: "https://maps.google.com/?q=Jacks+Wife+Freda+Carmine+St+NYC",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Shakshuka, waffles de rosewater o peri-peri chicken",
      tips: "Ambiente relajado, sin reserva. Buena opción de cena al regresar de Hudson Valley.",
      daySuggested: 6,
      visited: false
    },
    {
      id: "rec-26",
      name: "Russ & Daughters Cafe",
      category: "food",
      subcategory: "Desayuno Judío / Ahumados",
      zone: "Lower East Side",
      address: "127 Orchard St, New York, NY 10002",
      mapsUrl: "https://maps.google.com/?q=Russ+and+Daughters+Cafe+Orchard+St",
      price: "$$",
      paymentMethod: "both",
      mustOrder: "Salmón ahumado + bagel + cream cheese + latkes",
      tips: "El desayuno judío más histórico de NYC, más de 100 años. Llegar a las 7am para evitar fila el día de salida.",
      daySuggested: 7,
      visited: false
    }
  ],

  strandBooksList: [
    {
      id: "book-1",
      title: "CFA Curriculum 2025 Level I",
      author: "CFA Institute",
      category: "CFA Level 1",
      notes: "Buscar edición usada en Strand, precio mucho más accesible que nuevo.",
      acquired: false
    },
    {
      id: "book-2",
      title: "Wiley's Level I CFA Exam Review",
      author: "Wiley",
      category: "CFA Level 1",
      notes: "Complemento práctico de estudio, muy difícil de conseguir en México.",
      acquired: false
    },
    {
      id: "book-3",
      title: "Options, Futures, and Other Derivatives",
      author: "John C. Hull",
      category: "CFA & Finanzas Cuantitativas",
      notes: "La biblia indiscutible de los instrumentos derivados y gestión de riesgo.",
      acquired: false
    },
    {
      id: "book-4",
      title: "When Genius Failed: The Rise and Fall of Long-Term Capital Management",
      author: "Roger Lowenstein",
      category: "Economía & Mercados",
      notes: "El colapso de LTCM narrado con el suspenso y ritmo de una gran novela.",
      acquired: false
    },
    {
      id: "book-5",
      title: "The Alchemy of Finance",
      author: "George Soros",
      category: "Economía & Mercados",
      notes: "La teoría de la reflexividad y el método de toma de decisiones de Soros.",
      acquired: false
    },
    {
      id: "book-6",
      title: "A Philosophy of Software Design",
      author: "John Ousterhout",
      category: "Tecnología & Arquitectura",
      notes: "La obra definitiva sobre modularidad, complejidad profunda vs superficial.",
      acquired: false
    },
    {
      id: "book-7",
      title: "Staff Engineer: Leadership beyond the management track",
      author: "Will Larson",
      category: "Tecnología & Arquitectura",
      notes: "Crecimiento e impacto técnico de alto nivel para perfiles senior/staff.",
      acquired: false
    },
    {
      id: "book-8",
      title: "Mastering Bitcoin: Programming the Open Blockchain",
      author: "Andreas M. Antonopoulos",
      category: "Blockchain & Cripto",
      notes: "Perspectiva técnica rigurosa: criptografía, transacciones P2P, consenso y mining.",
      acquired: false
    },
    {
      id: "book-9",
      title: "The Bitcoin Standard: The Decentralized Alternative to Central Banking",
      author: "Saifedean Ammous",
      category: "Blockchain & Cripto",
      notes: "Análisis económico y monetario histórico de Bitcoin como dinero duro.",
      acquired: false
    },
    {
      id: "book-10",
      title: "Quantum Computing: An Applied Approach",
      author: "Jack D. Hidary",
      category: "Tecnología Emergente",
      notes: "Computación cuántica práctica con Python, Qiskit y Cirq. Casi imposible en México.",
      acquired: false
    }
  ],

  honeyDeuceTracker: {
    target: 4,
    currentCount: 0,
    priceEach: 25,
    glassSouvenirKept: 0,
    history: []
  },

  budgetExpenses: [
    { id: "exp-1", description: "Vuelo United MEX→EWR (2 personas)", amountUSD: 0, category: "Vuelos", method: "Tarjeta", date: "2026-09-04", note: "Pagado en paquete" },
    { id: "exp-2", description: "Hotel Marriott Marquis Times Square (6 noches)", amountUSD: 0, category: "Hospedaje", method: "Tarjeta", date: "2026-09-04", note: "Pagado en paquete" },
    { id: "exp-3", description: "4 Sesiones Arthur Ashe US Open", amountUSD: 0, category: "US Open", method: "Tarjeta", date: "2026-09-06", note: "Pagado en paquete" }
  ]
};
