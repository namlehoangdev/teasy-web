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

