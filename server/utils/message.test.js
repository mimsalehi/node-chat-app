var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe("Generate Message", ()=>{
    it('Should generate correct message object', ()=>{
        var from = 'Masoud';
        var text = 'Test Message';
        var message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toEqual(expect.objectContaining({from, text}))
    })
})

describe('Generate Location Message', ()=>{
    it('Should generate correct location object', ()=>{
        var from = 'Masoud';
        var latitude = 15;
        var longitude = 39;
        var url = 'https://www.google.com/maps?q=15,39';
        var message = generateLocationMessage(from, latitude, longitude)

        expect(typeof message.createdAt).toBe('number');
        expect(message).toEqual(expect.objectContaining({from, url}))
    })
})