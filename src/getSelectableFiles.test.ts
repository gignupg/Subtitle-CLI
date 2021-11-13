import getSelectableFiles, { emptyDirWarning, wrongArgsWarning, badInputWarning } from './getSelectableFiles';

describe('Return Value:', () => {
    test('should return array of all .srt and .mkv files!', () => {
        expect(getSelectableFiles('./src/assets/mixed_files')).toEqual(['movie1.mkv', 'movie2.MKV', 'subtitle1.srt', 'subtitle2.SRT']);
    });
});

describe('Warnings:', () => {
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

    test('should display emptyDirWarning if no .srt or .mkv files were found!', () => {
        getSelectableFiles('./src/assets/wrong_files');
        expect(consoleWarnMock).toHaveBeenLastCalledWith(emptyDirWarning);
    });

    test('should display wrongArgsWarning if wrong arguments were passed in!', () => {
        // @ts-ignore
        getSelectableFiles(1);
        expect(consoleWarnMock).toHaveBeenLastCalledWith(wrongArgsWarning);
    });

    test('should display badInputWarning if fs.readdirSync() failed!', () => {
        getSelectableFiles('/wrong/directory');
        expect(consoleWarnMock).toHaveBeenLastCalledWith(badInputWarning);
    });

    afterAll(() => consoleWarnMock.mockRestore());
});