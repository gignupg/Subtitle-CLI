import { getListOfAvailableFiles, emptyDirWarning, wrongArgsWarning, badInputWarning } from './index';

describe('Return Value:', () => {
    test.todo('should return array of all .srt and .mkv files!');
    test.todo('should ignore all files with wrong extension!');
});

describe('Warnings:', () => {
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

    test('should display emptyDirWarning if no .srt or .mkv files were found!', () => {
        getListOfAvailableFiles('./src/assets/wrong_files');
        expect(consoleWarnMock).toHaveBeenLastCalledWith(emptyDirWarning);
    });

    test('should display wrongArgsWarning if wrong arguments were passed in!', () => {
        // @ts-ignore
        getListOfAvailableFiles(1);
        expect(consoleWarnMock).toHaveBeenLastCalledWith(wrongArgsWarning);
    });

    test('should display badInputWarning if fs.readdirSync() failed!', () => {
        getListOfAvailableFiles('/this/dir/doesnt/exist');
        expect(consoleWarnMock).toHaveBeenLastCalledWith(badInputWarning);
    });

    afterAll(() => consoleWarnMock.mockRestore());
});