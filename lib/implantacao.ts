/**
 * Contornos dos lotes sobre a imagem de implantação (seção da home).
 *
 * Coordenadas no espaço da imagem Implantação.png (1822x1015). Os lotes 01 a 28
 * foram ajustados à mão pelo cliente sobre a foto; os demais vêm da planta
 * topográfica oficial (KGL-STR-DE-098.001-K07.001.R01), extraídos do desenho e
 * projetados na foto pela homografia calculada com os lotes já conferidos.
 *
 * Numeração: 01 a 52, contínua, como na planta. Este arquivo é apenas o
 * fallback — a fonte da verdade é a tabela implantacao_marcacoes no Supabase.
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
      '1244,557 1316,567 1282,670 1241,666 1246,633 1244,557',
    centroide: [1273, 610],
  },
  {
    numero: 5,
    pontos:
      '1189,554 1242,554 1245,630 1223,632 1212,665 1188,673 1189,554',
    centroide: [1213, 604],
  },
  {
    numero: 6,
    pontos:
      '1138,558 1188,556 1185,673 1144,692 1136,610 1138,558',
    centroide: [1162, 618],
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
      '674,418 673,479 671,533 635,513 603,475 605,466 636,438 674,418',
    centroide: [647, 475],
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
      '590,492 600,494 611,503 619,515 628,528 639,540 656,558 649,564 625,585 598,576 566,570 534,570 505,575 496,536 501,534 550,512 590,492',
    centroide: [576, 543],
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
      '1165,346 1227,350 1248,415 1165,409 1165,346',
    centroide: [1202, 382],
  },
  {
    numero: 32,
    pontos:
      '1094,334 1164,345 1161,409 1092,404 1094,334',
    centroide: [1127, 373],
  },
  {
    numero: 33,
    pontos:
      '1030,322 1093,333 1090,404 1026,399 1030,322',
    centroide: [1059, 365],
  },
  {
    numero: 34,
    pontos:
      '973,304 1029,322 1025,399 970,395 973,304',
    centroide: [999, 355],
  },
  {
    numero: 35,
    pontos:
      '924,286 972,304 969,395 921,391 924,286',
    centroide: [946, 344],
  },
  {
    numero: 36,
    pontos:
      '868,265 923,286 920,391 862,386 868,265',
    centroide: [893, 332],
  },
  {
    numero: 37,
    pontos:
      '803,248 867,266 861,387 816,383 803,248',
    centroide: [836, 317],
  },
  {
    numero: 38,
    pontos:
      '802,247 810,382 793,381 764,377 734,244 802,247',
    centroide: [777, 308],
  },
  {
    numero: 39,
    pontos:
      '668,259 732,244 764,381 717,387 668,259',
    centroide: [719, 314],
  },
  {
    numero: 40,
    pontos:
      '610,285 667,261 716,387 670,402 610,285',
    centroide: [665, 331],
  },
  {
    numero: 41,
    pontos:
      '562,317 609,285 669,402 628,424 562,317',
    centroide: [616, 355],
  },
  {
    numero: 42,
    pontos:
      '561,318 628,424 592,451 523,347 561,318',
    centroide: [576, 384],
  },
  {
    numero: 43,
    pontos:
      '481,384 522,349 591,453 563,476 557,483 481,384',
    centroide: [537, 416],
  },
  {
    numero: 44,
    pontos:
      '436,425 469,395 542,495 507,524 436,425',
    centroide: [489, 460],
  },
  {
    numero: 45,
    pontos:
      '401,452 435,426 506,525 468,552 401,452',
    centroide: [453, 489],
  },
  {
    numero: 46,
    pontos:
      '423,581 361,482 376,474 402,456 464,555 423,581',
    centroide: [413, 519],
  },
  {
    numero: 47,
    pontos:
      '308,512 360,482 422,581 419,583 369,611 308,512',
    centroide: [365, 547],
  },
  {
    numero: 48,
    pontos:
      '180,602 306,513 365,610 361,615 353,621 344,621 336,617 329,611 301,618 180,602',
    centroide: [285, 579],
  },
  {
    numero: 49,
    pontos:
      '180,603 299,619 319,637 328,637 334,639 208,690 180,603',
    centroide: [243, 641],
  },
  {
    numero: 50,
    pontos:
      '210,692 338,642 342,644 343,650 357,675 360,682 267,755 210,692',
    centroide: [288, 695],
  },
  {
    numero: 51,
    pontos:
      '269,757 363,680 382,693 388,699 400,708 361,801 269,757',
    centroide: [344, 741],
  },
  {
    numero: 52,
    pontos:
      '362,801 401,709 419,698 427,700 474,716 462,801 362,801',
    centroide: [424, 756],
  },
];
