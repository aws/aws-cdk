"use strict";
exports.handler = async (evt) => {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(evt, undefined, 2));
    return {
        statusCode: 200,
        body: 'hello, cors!',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsR0FBUSxFQUFFLEVBQUU7SUFDbkMsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakQsT0FBTztRQUNMLFVBQVUsRUFBRSxHQUFHO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFO1lBQ1AsNkJBQTZCLEVBQUUsR0FBRztTQUNuQztLQUNGLENBQUM7QUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZ0OiBhbnkpID0+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShldnQsIHVuZGVmaW5lZCwgMikpO1xuICByZXR1cm4ge1xuICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICBib2R5OiAnaGVsbG8sIGNvcnMhJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgIH0sXG4gIH07XG59OyJdfQ==