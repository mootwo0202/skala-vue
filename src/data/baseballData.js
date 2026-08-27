export const BASEBALL_STADIUMS = [
  {
    id: 'jamsil',
    shortName: '잠실',
    name: '잠실야구장',
    lat: 37.5122,
    lon: 127.0719,
    isDome: false,
    aliases: ['잠실'],
  },
  {
    id: 'gocheok',
    shortName: '고척',
    name: '고척스카이돔',
    lat: 37.4982,
    lon: 126.8671,
    isDome: true,
    aliases: ['고척', '스카이돔'],
  },
  {
    id: 'incheon',
    shortName: '문학',
    name: '인천 SSG 랜더스필드',
    lat: 37.437,
    lon: 126.6933,
    isDome: false,
    aliases: ['문학', '인천', '랜더스필드'],
  },
  {
    id: 'suwon',
    shortName: '수원',
    name: '수원 KT 위즈파크',
    lat: 37.2998,
    lon: 127.0097,
    isDome: false,
    aliases: ['수원', '위즈파크'],
  },
  {
    id: 'daejeon',
    shortName: '대전',
    name: '대전 한화생명 볼파크',
    lat: 36.3171,
    lon: 127.4291,
    isDome: false,
    aliases: ['대전', '한화생명', '볼파크'],
  },
  {
    id: 'gwangju',
    shortName: '광주',
    name: '광주 KIA 챔피언스필드',
    lat: 35.1682,
    lon: 126.8891,
    isDome: false,
    aliases: ['광주', '챔피언스필드'],
  },
  {
    id: 'daegu',
    shortName: '대구',
    name: '대구 삼성 라이온즈파크',
    lat: 35.8411,
    lon: 128.6817,
    isDome: false,
    aliases: ['대구', '라이온즈파크'],
  },
  {
    id: 'sajik',
    shortName: '사직',
    name: '부산 사직야구장',
    lat: 35.194,
    lon: 129.0615,
    isDome: false,
    aliases: ['사직', '부산'],
  },
  {
    id: 'changwon',
    shortName: '창원',
    name: '창원 NC파크',
    lat: 35.2225,
    lon: 128.5824,
    isDome: false,
    aliases: ['창원', 'NC파크'],
  },
]

const normalizeStadiumName = (name) =>
  String(name ?? '')
    .replace(/\s|야구장/g, '')
    .toLowerCase()

export const findStadium = (stadiumName) => {
  const normalizedName = normalizeStadiumName(stadiumName)

  return BASEBALL_STADIUMS.find((stadium) =>
    stadium.aliases.some((alias) => normalizedName.includes(normalizeStadiumName(alias))),
  )
}
