/**
 * Contornos dos lotes sobre a imagem de implantação (seção da home).
 *
 * Coordenadas no espaço da imagem Implantação.png (1822x1015). Extraídas
 * automaticamente dos overlays do arquiteto e depois AJUSTADAS À MÃO pelo
 * cliente na tela /implantacao-editor, encaixando cada lote no desenho.
 *
 * Numeração real dos lotes: 01-28 e 31-54. Os lotes 29 e 30 pertencem ao
 * condomínio e ficam de fora de propósito.
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
      '1425,608 1474,634 1403,745 1369,714 1425,608',
    centroide: [1419, 673],
  },
  {
    numero: 2,
    pontos:
      '1372,585 1425,608 1371,714 1330,689 1372,586',
    centroide: [1376, 647],
  },
  {
    numero: 3,
    pontos:
      '1319,569 1372,585 1329,689 1286,669 1318,569',
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
      '929,577 936,656 878,668 870,586',
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
      '1164,485 1280,487 1287,546 1226,539 1164,540 1163,485',
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
      '1063,485 1082,485 1080,545 1006,553 1007,485 1063,485',
    centroide: [1043, 517],
  },
  {
    numero: 15,
    pontos:
      '937,484 1007,486 1006,553 958,554 938,557 937,485',
    centroide: [972, 520],
  },
  {
    numero: 16,
    pontos:
      '871,483 938,484 938,557 870,565 870,484',
    centroide: [903, 523],
  },
  {
    numero: 17,
    pontos:
      '808,483 871,484 870,566 835,570 806,569 807,483',
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
      '745,399 748,400 746,480 672,478 673,421 708,407 745,400',
    centroide: [712, 444],
  },
  {
    numero: 22,
    pontos:
      '765,398 809,400 808,483 745,480 747,400 764,398',
    centroide: [778, 440],
  },
  {
    numero: 23,
    pontos:
      '809,400 871,405 870,484 807,483 808,400',
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
      '1007,416 1081,420 1082,437 1082,486 1007,486 1007,417',
    centroide: [1044, 452],
  },
  {
    numero: 27,
    pontos:
      '1082,420 1163,426 1164,485 1082,485 1082,421',
    centroide: [1122, 454],
  },
  {
    numero: 28,
    pontos:
      '1164,426 1241,432 1262,442 1271,439 1275,435 1280,487 1163,485 1163,426',
    centroide: [1218, 459],
  },
  {
    numero: 31,
    pontos:
      '583,495 596,502 627,530 649,543 630,571 607,568 577,568 541,572 512,587 488,558 583,495',
    centroide: [573, 544],
  },
  {
    numero: 32,
    pontos:
      '487,556 510,587 490,602 464,625 436,656 422,692 357,665 353,638 372,628 437,589',
    centroide: [446, 613],
  },
  {
    numero: 33,
    pontos:
      '1164,344 1192,349 1227,349 1248,411 1247,417 1241,417 1233,416 1233,411 1229,410 1223,415 1161,410 1164,345',
    centroide: [1201, 382],
  },
  {
    numero: 34,
    pontos:
      '1094,332 1164,345 1162,404 1159,405 1158,410 1091,405 1093,332',
    centroide: [1127, 372],
  },
  {
    numero: 35,
    pontos:
      '1029,321 1094,332 1091,399 1089,405 1028,401 1026,399 1029,321',
    centroide: [1059, 365],
  },
  {
    numero: 36,
    pontos:
      '972,302 1029,321 1026,400 971,396 972,303',
    centroide: [999, 355],
  },
  {
    numero: 37,
    pontos:
      '923,285 972,303 970,396 921,391 923,285',
    centroide: [946, 344],
  },
  {
    numero: 38,
    pontos:
      '868,265 924,285 920,391 861,385 867,265',
    centroide: [892, 332],
  },
  {
    numero: 39,
    pontos:
      '802,247 868,265 862,385 815,383 802,247',
    centroide: [836, 317],
  },
  {
    numero: 40,
    pontos:
      '745,243 793,244 803,247 814,383 764,380 733,244 745,243',
    centroide: [778, 309],
  },
  {
    numero: 41,
    pontos:
      '731,243 734,244 765,382 716,389 668,260 672,257 730,244',
    centroide: [719, 314],
  },
  {
    numero: 42,
    pontos:
      '666,259 669,261 717,389 668,403 609,284 665,259',
    centroide: [665, 331],
  },
  {
    numero: 43,
    pontos:
      '608,283 669,405 626,425 562,318 561,314 608,284',
    centroide: [615, 355],
  },
  {
    numero: 44,
    pontos:
      '627,426 591,453 522,345 560,316',
    centroide: [575, 385],
  },
  {
    numero: 45,
    pontos:
      '522,345 592,454 558,485 480,384 521,345',
    centroide: [536, 415],
  },
  {
    numero: 46,
    pontos:
      '467,394 538,491 506,524 434,425 467,395',
    centroide: [490, 460],
  },
  {
    numero: 47,
    pontos:
      '434,424 507,525 464,553 399,452 433,425',
    centroide: [454, 489],
  },
  {
    numero: 48,
    pontos:
      '399,451 467,553 422,581 361,483 399,452',
    centroide: [414, 517],
  },
  {
    numero: 49,
    pontos:
      '356,480 419,582 370,612 306,515',
    centroide: [367, 547],
  },
  {
    numero: 50,
    pontos:
      '306,514 370,612 352,624 340,620 332,609 326,606 317,608 306,619 180,603 191,585 260,547',
    centroide: [285, 579],
  },
  {
    numero: 51,
    pontos:
      '180,603 308,618 309,628 315,635 332,634 333,637 335,635 341,637 339,642 201,693 180,657 173,637 173,615 180,604',
    centroide: [239, 643],
  },
  {
    numero: 52,
    pontos:
      '343,639 346,640 345,643 347,644 347,662 351,662 365,680 263,758 246,746 201,693 342,640',
    centroide: [285, 697],
  },
  {
    numero: 53,
    pontos:
      '365,679 387,692 395,704 403,707 359,802 327,795 285,776 262,758 361,678',
    centroide: [340, 743],
  },
  {
    numero: 54,
    pontos:
      '428,696 478,712 465,800 359,801 395,716 411,705 419,697 427,697',
    centroide: [426, 755],
  },
];
