/**
 * Contornos dos lotes sobre a imagem de implantação (seção da home).
 *
 * Coordenadas no espaço da imagem Implantação.png (1822x1015). Extraídas
 * automaticamente dos overlays do arquiteto e depois AJUSTADAS À MÃO pelo
 * cliente na tela /admin/implantacao, encaixando cada lote no desenho.
 *
 * Numeração: 01 a 52, contínua, conforme a planta topográfica oficial
 * (KGL-STR-DE-098.001-K07.001.R01). Este arquivo é apenas o fallback —
 * a fonte da verdade é a tabela implantacao_marcacoes no Supabase.
 */

export const IMPLANTACAO_CANVAS = { width: 1822, height: 1015 } as const;

export interface LoteContorno {
  numero: number;
  /** Pares "x,y" no espaço do canvas, prontos para <polygon points> */
  pontos: string;
  /** Centro visual do lote (posição do rótulo com o número) */
  centroide: [number, number];
}

export const contornosLotes: LoteContorno[] = [
  {
    numero: 1,
    pontos:
      '1425,608 1454,623 1474,634 1403,745 1369,714',
    centroide: [1419, 673],
  },
  {
    numero: 2,
    pontos:
      '1372,585 1425,608 1371,714 1330,689',
    centroide: [1376, 647],
  },
  {
    numero: 3,
    pontos:
      '1319,569 1372,585 1329,689 1286,669',
    centroide: [1328, 626],
  },
  {
    numero: 4,
    pontos:
      '1243,556 1315,566 1280,671 1247,665',
    centroide: [1277, 610],
  },
  {
    numero: 5,
    pontos:
      '1191,554 1243,557 1245,632 1218,632 1217,666 1187,670 1191,554',
    centroide: [1217, 606],
  },
  {
    numero: 6,
    pontos:
      '1189,554 1186,673 1143,688 1134,605 1136,555',
    centroide: [1163, 615],
  },
  {
    numero: 7,
    pontos:
      '1138,557 1135,612 1109,624 1087,649 1085,688 1048,669 1045,565 1081,558',
    centroide: [1083, 606],
  },
  {
    numero: 8,
    pontos:
      '1045,564 1048,666 998,657 992,570',
    centroide: [1021, 615],
  },
  {
    numero: 9,
    pontos:
      '993,571 999,657 937,656 929,577',
    centroide: [965, 615],
  },
  {
    numero: 10,
    pontos:
      '929,577 936,656 878,668 870,586 898,582',
    centroide: [904, 620],
  },
  {
    numero: 11,
    pontos:
      '878,669 830,689 802,664 804,590 837,590 870,586',
    centroide: [839, 635],
  },
  {
    numero: 12,
    pontos:
      '1164,485 1280,487 1287,546 1187,541 1164,540',
    centroide: [1224, 514],
  },
  {
    numero: 13,
    pontos:
      '1082,485 1163,485 1164,540 1080,545 1082,485',
    centroide: [1122, 514],
  },
  {
    numero: 14,
    pontos:
      '1007,485 1063,485 1082,485 1080,545 1006,553',
    centroide: [1043, 517],
  },
  {
    numero: 15,
    pontos:
      '937,484 1007,486 1006,553 958,554 938,557',
    centroide: [972, 520],
  },
  {
    numero: 16,
    pontos:
      '871,483 938,484 938,557 895,562 870,565',
    centroide: [903, 523],
  },
  {
    numero: 17,
    pontos:
      '808,483 871,484 870,566 835,570 806,569',
    centroide: [838, 526],
  },
  {
    numero: 18,
    pontos:
      '746,480 808,483 807,569 800,570 745,559 746,480',
    centroide: [777, 523],
  },
  {
    numero: 19,
    pontos:
      '672,478 746,480 745,559 712,549 674,531 672,478',
    centroide: [712, 513],
  },
  {
    numero: 20,
    pontos:
      '672,421 674,531 630,505 608,481 613,478 613,474 607,470 631,444 672,421',
    centroide: [648, 476],
  },
  {
    numero: 21,
    pontos:
      '748,398 747,481 672,476 673,421 708,404',
    centroide: [712, 442],
  },
  {
    numero: 22,
    pontos:
      '747,400 765,398 809,400 808,483 745,480',
    centroide: [778, 440],
  },
  {
    numero: 23,
    pontos:
      '809,400 871,405 870,484 807,483',
    centroide: [839, 443],
  },
  {
    numero: 24,
    pontos:
      '871,405 938,411 937,485 870,484 871,405',
    centroide: [904, 446],
  },
  {
    numero: 25,
    pontos:
      '938,411 1008,417 1007,486 938,485 938,411',
    centroide: [972, 450],
  },
  {
    numero: 26,
    pontos:
      '1007,416 1081,420 1082,437 1082,486 1007,486',
    centroide: [1044, 452],
  },
  {
    numero: 27,
    pontos:
      '1082,420 1163,426 1164,485 1082,485',
    centroide: [1122, 454],
  },
  {
    numero: 28,
    pontos:
      '1164,426 1241,432 1262,442 1271,439 1275,435 1280,487 1163,485',
    centroide: [1218, 459],
  },
  {
    numero: 29,
    pontos:
      '583,495 649,543 630,571 541,572 488,558',
    centroide: [573, 544],
  },
  {
    numero: 30,
    pontos:
      '487,556 510,587 422,692 353,638',
    centroide: [446, 613],
  },
  {
    numero: 31,
    pontos:
      '1164,344 1227,349 1247,417 1161,410',
    centroide: [1201, 382],
  },
  {
    numero: 32,
    pontos:
      '1094,332 1164,345 1158,410 1091,405',
    centroide: [1127, 372],
  },
  {
    numero: 33,
    pontos:
      '1029,321 1094,332 1089,405 1028,401',
    centroide: [1059, 365],
  },
  {
    numero: 34,
    pontos:
      '972,302 1029,321 1026,400 971,396',
    centroide: [999, 355],
  },
  {
    numero: 35,
    pontos:
      '923,285 972,303 970,396 921,391 923,285',
    centroide: [946, 344],
  },
  {
    numero: 36,
    pontos:
      '868,265 924,285 920,391 861,385',
    centroide: [892, 332],
  },
  {
    numero: 37,
    pontos:
      '802,247 868,265 862,385 815,383',
    centroide: [836, 316],
  },
  {
    numero: 38,
    pontos:
      '745,243 793,244 803,247 814,383 764,380 733,244 745,243',
    centroide: [778, 309],
  },
  {
    numero: 39,
    pontos:
      '731,243 734,244 765,382 716,389 668,260 672,257',
    centroide: [719, 314],
  },
  {
    numero: 40,
    pontos:
      '666,259 669,261 717,389 668,403 609,284',
    centroide: [665, 331],
  },
  {
    numero: 41,
    pontos:
      '608,283 669,405 626,425 562,318 561,314',
    centroide: [615, 355],
  },
  {
    numero: 42,
    pontos:
      '627,426 591,453 522,345 560,316',
    centroide: [575, 385],
  },
  {
    numero: 43,
    pontos:
      '522,345 592,454 558,485 480,384',
    centroide: [536, 415],
  },
  {
    numero: 44,
    pontos:
      '467,394 538,491 506,524 434,425',
    centroide: [490, 460],
  },
  {
    numero: 45,
    pontos:
      '434,424 507,525 464,553 399,452',
    centroide: [454, 489],
  },
  {
    numero: 46,
    pontos:
      '399,451 467,553 422,581 361,483',
    centroide: [414, 517],
  },
  {
    numero: 47,
    pontos:
      '356,480 419,582 370,612 306,515',
    centroide: [367, 547],
  },
  {
    numero: 48,
    pontos:
      '306,514 370,612 352,624 340,620 332,609 326,606 317,608 306,619 180,603 191,585 260,547',
    centroide: [285, 579],
  },
  {
    numero: 49,
    pontos:
      '179,603 308,618 309,628 315,635 329,633 341,642 209,695 183,662 171,629',
    centroide: [240, 643],
  },
  {
    numero: 50,
    pontos:
      '343,639 346,640 345,643 347,662 351,662 365,680 263,758 246,746 201,693',
    centroide: [285, 697],
  },
  {
    numero: 51,
    pontos:
      '365,679 387,692 395,704 403,707 359,802 327,795 285,776 262,758 361,678',
    centroide: [340, 743],
  },
  {
    numero: 52,
    pontos:
      '428,696 478,712 465,800 359,801 395,716 411,705 419,697',
    centroide: [426, 755],
  },
];
