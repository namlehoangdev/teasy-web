export {default as fakeUsers} from './fake-users';
export {default as fakeQuestions} from './fake-questions';
export {default as fakeContests} from './fake-contests';
export {default as fakeCompetingContest} from './fake-competing-contest';

export const fakeNormalizedContest = {
    byId: [
        '5dfdfea4f2136b24e0dd5c65',
        '5dfdff0ff2136b24e0dd5c66'
    ],
    byHash: {
        '5dfdfea4f2136b24e0dd5c65': {
            id: '5dfdfea4f2136b24e0dd5c65',
            name: 'Cuộc thi A',
            ownerId: '5dfdaf64b9d6c528ecb242b6',
            ownerName: 'Nam Lê',
            testIds: [
                '5dfddf65bc4e5a1290917e35',
                '5dfddfa9f2136b24e0dd5c62'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T11:14:44.987Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [],
            isPublic: true,
            description: '',
            password: '',
            isSecured: false,
            code: 2,
            hasFullAnswers: false,
            category: -1
        },
        '5dfdff0ff2136b24e0dd5c66': {
            id: '5dfdff0ff2136b24e0dd5c66',
            name: 'Cuộc thi A',
            ownerId: '5dfdaf64b9d6c528ecb242b6',
            ownerName: 'Nam Lê',
            backgroundUrl: 'https://firebasestorage.googleapis.com/v0/b/teasy-1571463510829.appspot.com/o/Competition%2F5dfdaf64b9d6c528ecb242b6%2F270c6c78-b4f4-4a10-af95-fb0e4f8f0b57?alt=media&token=5c736fd8-4889-44d1-a9d4-53941a94069f',
            testIds: [
                '5dfddf65bc4e5a1290917e35',
                '5dfddfa9f2136b24e0dd5c62'
            ],
            startAt: '2019-12-19T11:16:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T11:16:31.995Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdab30b9d6c528ecb242b5',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'gffggfgf',
            password: '',
            isSecured: false,
            code: 3,
            hasFullAnswers: false,
            category: -1
        }
    }
}


export const fakePlaygroundContests = {
    byId: [
        '5dfdfad7f2136b24e0dd5c64',
        '5dfdfea4f2136b24e0dd5c65',
        '5dfe0d321e38be15d4b317fc',
        '5dfe0e4d30f11b2bf0f2ab8b',
        '5dfdff0ff2136b24e0dd5c66',
        '5dfe09c01e38be15d4b317fb',
        '5dfe0df030f11b2bf0f2ab89',
        '5dfe0df430f11b2bf0f2ab8a',
        '5dfe0e7b30f11b2bf0f2ab8c',
        '5dfe0fd130f11b2bf0f2ab8d',
        '5dfe0feabffa4d04b01a7336',
        '5dfe139f80c5103670cf4890',
        '5dfe13a480c5103670cf4891',
        '5dfe13bb80c5103670cf4892',
        '5dfe1464bee92829c4d68987',
        '5dfe1469bee92829c4d68988',
        '5dff031d2972982e04205dcd',
        '5dff033e2972982e04205dce'
    ],
    byHash: {
        '5dfdfad7f2136b24e0dd5c64': {
            id: '5dfdfad7f2136b24e0dd5c64',
            name: 'sadasdasd',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            startAt: '2019-12-19T10:58:00Z',
            endAt: '0001-01-01T00:00:00',
            createdAt: '2019-12-21T10:58:31.106Z',
            duration: 5400000,
            useSEB: false,
            isPublic: true,
            description: 'asdasdas',
            isSecured: false,
            code: 0,
            hasFullAnswers: false,
            category: 0
        },
        '5dfdfea4f2136b24e0dd5c65': {
            id: '5dfdfea4f2136b24e0dd5c65',
            name: 'Cuộc thi A',
            ownerId: '5dfdaf64b9d6c528ecb242b6',
            ownerName: 'Nam Lê',
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00',
            createdAt: '2019-12-21T11:14:44.987Z',
            duration: 5400000,
            useSEB: false,
            isPublic: true,
            description: '',
            isSecured: false,
            code: 0,
            hasFullAnswers: false,
            category: 0
        },
        '5dfe0d321e38be15d4b317fc': {
            id: '5dfe0d321e38be15d4b317fc',
            name: 'Cuoc thi B',
            ownerId: '5dfdaf64b9d6c528ecb242b6',
            ownerName: 'Nam Lê',
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00',
            createdAt: '2019-12-21T12:16:50.944Z',
            duration: 5400000,
            useSEB: false,
            isPublic: true,
            description: '',
            isSecured: false,
            code: 0,
            hasFullAnswers: false,
            category: 0
        },
        '5dfe0e4d30f11b2bf0f2ab8b': {
            id: '5dfe0e4d30f11b2bf0f2ab8b',
            name: 'Cuộc thi C',
            ownerId: '5dfdaf64b9d6c528ecb242b6',
            ownerName: 'Nam Lê',
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00',
            createdAt: '2019-12-21T12:21:33.019Z',
            duration: 5400000,
            useSEB: false,
            isPublic: true,
            description: '',
            isSecured: false,
            code: 0,
            hasFullAnswers: false,
            category: 0
        },
        '5dfdff0ff2136b24e0dd5c66': {
            id: '5dfdff0ff2136b24e0dd5c66',
            name: 'Cuộc thi A',
            ownerId: '5dfdaf64b9d6c528ecb242b6',
            ownerName: 'Nam Lê',
            backgroundUrl: 'https://firebasestorage.googleapis.com/v0/b/teasy-1571463510829.appspot.com/o/Competition%2F5dfdaf64b9d6c528ecb242b6%2F270c6c78-b4f4-4a10-af95-fb0e4f8f0b57?alt=media&token=5c736fd8-4889-44d1-a9d4-53941a94069f',
            testIds: [
                '5dfddf65bc4e5a1290917e35',
                '5dfddfa9f2136b24e0dd5c62'
            ],
            startAt: '2019-12-19T11:16:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T11:16:31.995Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdab30b9d6c528ecb242b5',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'gffggfgf',
            password: '',
            isSecured: false,
            code: 3,
            hasFullAnswers: false,
            category: -1
        },
        '5dfe09c01e38be15d4b317fb': {
            id: '5dfe09c01e38be15d4b317fb',
            name: 'ádasdasdasd',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:02:08.979Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'ádasdasdsad',
            password: '',
            isSecured: false,
            code: 4,
            hasFullAnswers: true,
            category: -1
        },
        '5dfe0df030f11b2bf0f2ab89': {
            id: '5dfe0df030f11b2bf0f2ab89',
            name: 'ádasdasdasd',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:20:00.596Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'ádasdasdsad',
            password: '',
            isSecured: false,
            code: 6,
            hasFullAnswers: true,
            category: -1
        },
        '5dfe0df430f11b2bf0f2ab8a': {
            id: '5dfe0df430f11b2bf0f2ab8a',
            name: 'ádasdasdasd',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:20:04.583Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'ádasdasdsad',
            password: '',
            isSecured: false,
            code: 7,
            hasFullAnswers: true,
            category: -1
        },
        '5dfe0e7b30f11b2bf0f2ab8c': {
            id: '5dfe0e7b30f11b2bf0f2ab8c',
            name: 'Cuộc Thi D',
            ownerId: '5dfdaf64b9d6c528ecb242b6',
            ownerName: 'Nam Lê',
            testIds: [
                '5dfddf65bc4e5a1290917e35',
                '5dfddf7dbc4e5a1290917e36',
                '5dfddfa9f2136b24e0dd5c62',
                '5dfddfbdf2136b24e0dd5c63'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:22:19.076Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: '',
            password: '',
            isSecured: false,
            code: 9,
            hasFullAnswers: false,
            category: -1
        },
        '5dfe0fd130f11b2bf0f2ab8d': {
            id: '5dfe0fd130f11b2bf0f2ab8d',
            name: 'ádasdasdasd',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:28:01.852Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'ádasdasdsad',
            password: '',
            isSecured: false,
            code: 10,
            hasFullAnswers: true,
            category: -1
        },
        '5dfe0feabffa4d04b01a7336': {
            id: '5dfe0feabffa4d04b01a7336',
            name: 'ádasdasdasd',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:28:26.393Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'ádasdasdsad',
            password: '',
            isSecured: false,
            code: 11,
            hasFullAnswers: true,
            category: -1
        },
        '5dfe139f80c5103670cf4890': {
            id: '5dfe139f80c5103670cf4890',
            name: 'Chó Nhật ăn cứt ',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:44:15.011Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'ádasdasdsad',
            password: '',
            isSecured: false,
            code: 12,
            hasFullAnswers: true,
            category: -1
        },
        '5dfe13a480c5103670cf4891': {
            id: '5dfe13a480c5103670cf4891',
            name: 'Chó Nhật ăn cứt ',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:44:20.224Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'ádasdasdsad',
            password: '',
            isSecured: false,
            code: 13,
            hasFullAnswers: true,
            category: -1
        },
        '5dfe13bb80c5103670cf4892': {
            id: '5dfe13bb80c5103670cf4892',
            name: 'Chó Nhật ăn cứt ',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:44:43.977Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'ádasdasdsad',
            password: '',
            isSecured: false,
            code: 14,
            hasFullAnswers: true,
            category: -1
        },
        '5dfe1464bee92829c4d68987': {
            id: '5dfe1464bee92829c4d68987',
            name: 'Chó Nhật ăn cứt ',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:47:32.763Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'ádasdasdsad',
            password: '',
            isSecured: false,
            code: 15,
            hasFullAnswers: true,
            category: -1
        },
        '5dfe1469bee92829c4d68988': {
            id: '5dfe1469bee92829c4d68988',
            name: 'Chó Nhật ăn cứt ',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-21T12:47:37.413Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: 'ádasdasdsad',
            password: '',
            isSecured: false,
            code: 16,
            hasFullAnswers: true,
            category: -1
        },
        '5dff031d2972982e04205dcd': {
            id: '5dff031d2972982e04205dcd',
            name: 'Cuoc thi dep trai',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-22T05:46:05.852Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: '',
            password: '',
            isSecured: false,
            code: 17,
            hasFullAnswers: true,
            category: -1
        },
        '5dff033e2972982e04205dce': {
            id: '5dff033e2972982e04205dce',
            name: 'asdasdasd',
            ownerId: '5dfdab30b9d6c528ecb242b5',
            ownerName: 'Minh Kien Ngo',
            testIds: [
                '5dfdb1cab9d6c528ecb242b8'
            ],
            startAt: '0001-01-01T00:00:00Z',
            endAt: '0001-01-01T00:00:00Z',
            createdAt: '2019-12-22T05:46:38.855Z',
            duration: 5400000,
            useSEB: false,
            permittedUsers: [
                '5dfdab30b9d6c528ecb242b5',
                '5dfdaf64b9d6c528ecb242b6',
                '5dfdb0f1b9d6c528ecb242b7'
            ],
            isPublic: false,
            description: '',
            password: '',
            isSecured: false,
            code: 18,
            hasFullAnswers: true,
            category: -1
        }
    }
};


