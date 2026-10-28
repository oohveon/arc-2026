// 작품 데이터. image가 없으면 Figma 시안의 회색 썸네일 플레이스홀더로 표시된다.
export const CATEGORIES = ['All', 'Graphic', 'Media', 'Spatial', 'Fashion', 'Product', 'Art & Craft'] as const
export type Category = (typeof CATEGORIES)[number]

export interface Project {
  id: string
  category: Exclude<Category, 'All'>
  title: string
  team: string
  members: string
  contacts: string[]
  image: string | null
  description: string
}

export interface MapWork {
  no: number
  title: string
  artists: string
}

export interface Floor {
  image: string
  label: string
  works: MapWork[]
}

export interface BehindItem {
  no: number
  title: string
  image: string
}

export const PROJECTS: Project[] = [
  {
    id: 'gap-of-language',
    category: 'Graphic',
    title: '언어의 틈',
    team: '언어연구소',
    members: '이여진 김세은 김나은 양윤 이동은',
    contacts: ['0to179', 'nanan__a__a', 'dong_eun.01', 'yooniverse_yoon', 'aftershock.__03'],
    image: '/assets/project-graphic-01.png',
    description:
      '디자인과 개발 사이에서 기준을 세우고 조율하는 과정은 많은 에너지가 필요합니다. 보이지 않던 화면의 뼈대를 잡고 여백과 색상의 규칙을 정하는 모든 순간이 값진 밑거름이 됩니다. 지금 고민하는 작은 디테일들이 모여 관람객에게 감각적인 경험을 선사할 것입니다. 치열하게 고민한 오늘 하루 정말 고생 많으셨습니다. 멋진 결과물로 잘 이어지길 진심으로 응원합니다.',
  },
  ...(['Media', 'Spatial', 'Fashion', 'Product', 'Art & Craft', 'Graphic'] as const).map((category, i) => ({
    id: `placeholder-${i + 1}`,
    category,
    title: '[작품 제목]',
    team: '[팀 이름]',
    members: '[참가자 이름]',
    contacts: [],
    image: null,
    description: '[작품 설명]',
  })),
]

// 전시장 지도 작품 목록 (2F 5관 / 3F 그랜드관)
const placeholders = (from: number, to: number): MapWork[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({ no: from + i, title: '[작품 제목]', artists: '[참가자 이름]' }))

export type FloorKey = '2F' | '3F'
export const FLOORS: FloorKey[] = ['2F', '3F']

export const MAP_WORKS: Record<FloorKey, Floor> = {
  '2F': {
    image: '/assets/map-2f.png',
    label: '2F Gallery 5',
    works: [
      { no: 1, title: '언어의 틈', artists: '김세린 박기현' },
      { no: 2, title: '가스라이팅', artists: '강주성 김인우 이보영' },
      { no: 3, title: '기억', artists: '이서현' },
      ...placeholders(4, 23),
    ],
  },
  '3F': {
    image: '/assets/map-3f.png',
    label: '3F Grand Hall',
    works: [
      { no: 1, title: '언어의 틈', artists: '김세린 박기현' },
      { no: 2, title: '가스라이팅', artists: '강주성 김인우 이보영' },
      { no: 3, title: '기억', artists: '이서현' },
      ...placeholders(4, 23),
    ],
  },
}

export const BEHIND: BehindItem[] = [
  { no: 1, title: '36.5℃의 계절을 찾다', image: '/assets/behind/01.jpg' },
  { no: 2, title: '36.5℃의 맛을 찾다', image: '/assets/behind/02.jpg' },
  { no: 3, title: '36.5℃의 bgm을 찾다', image: '/assets/behind/03.jpg' },
  { no: 4, title: '36.5℃의 bgm을 찾다', image: '/assets/behind/04.jpg' },
  { no: 5, title: '36.5℃의 소리를 찾다', image: '/assets/behind/05.jpg' },
  { no: 6, title: '36.5℃의 공간을 찾다', image: '/assets/behind/06.jpg' },
  { no: 7, title: '36.5℃의 계절을 찾다', image: '/assets/behind/07.jpg' },
]
