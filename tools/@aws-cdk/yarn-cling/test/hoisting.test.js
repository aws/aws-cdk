"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hoisting_1 = require("../lib/hoisting");
test('nonconflicting tree gets flattened', () => {
    // GIVEN
    const tree = pkg('*', {
        stringutil: {
            version: '1.0.0',
            dependencies: {
                leftpad: { version: '2.0.0' },
            },
        },
        numutil: {
            version: '3.0.0',
            dependencies: {
                isodd: { version: '4.0.0' },
            },
        },
    });
    // WHEN
    (0, hoisting_1.hoistDependencies)(tree);
    // THEN
    expect((0, hoisting_1.renderTree)(tree)).toEqual([
        'isodd=4.0.0',
        'leftpad=2.0.0',
        'numutil=3.0.0',
        'stringutil=1.0.0',
    ]);
});
test('matching versions get deduped', () => {
    // GIVEN
    const tree = pkg('*', {
        stringutil: {
            version: '1.0.0',
            dependencies: {
                leftpad: { version: '2.0.0' },
            },
        },
        numutil: {
            version: '3.0.0',
            dependencies: {
                leftpad: { version: '2.0.0' },
                isodd: { version: '4.0.0' },
            },
        },
    });
    // WHEN
    (0, hoisting_1.hoistDependencies)(tree);
    // THEN
    expect((0, hoisting_1.renderTree)(tree)).toEqual([
        'isodd=4.0.0',
        'leftpad=2.0.0',
        'numutil=3.0.0',
        'stringutil=1.0.0',
    ]);
});
test('conflicting versions get left in place', () => {
    // GIVEN
    const tree = pkg('*', {
        stringutil: {
            version: '1.0.0',
            dependencies: {
                leftpad: { version: '2.0.0' },
            },
        },
        numutil: {
            version: '3.0.0',
            dependencies: {
                leftpad: { version: '5.0.0' },
                isodd: { version: '4.0.0' },
            },
        },
    });
    // WHEN
    (0, hoisting_1.hoistDependencies)(tree);
    // THEN
    expect((0, hoisting_1.renderTree)(tree)).toEqual([
        'isodd=4.0.0',
        'leftpad=2.0.0',
        'numutil=3.0.0',
        'numutil.leftpad=5.0.0',
        'stringutil=1.0.0',
    ]);
});
test('dependencies of deduped packages are not hoisted into useless positions', () => {
    // GIVEN
    const tree = pkg('*', {
        stringutil: pkg('1.0.0', {
            leftpad: pkg('2.0.0', {
                spacemaker: pkg('3.0.0'),
            }),
        }),
        leftpad: pkg('2.0.0', {
            spacemaker: pkg('3.0.0'),
        }),
        spacemaker: pkg('4.0.0'),
    });
    // WHEN
    (0, hoisting_1.hoistDependencies)(tree);
    // THEN
    expect((0, hoisting_1.renderTree)(tree)).toEqual([
        'leftpad=2.0.0',
        'leftpad.spacemaker=3.0.0',
        'spacemaker=4.0.0',
        'stringutil=1.0.0',
    ]);
});
test('dont hoist into a parent if it would cause an incorrect version there', () => {
    // GIVEN
    const tree = pkg('*', {
        stringutil: pkg('1.0.0', {
            spacemaker: pkg('10.0.0'),
            leftPad: pkg('2.0.0', {
                spacemaker: pkg('3.0.0'),
            }),
        }),
        leftPad: pkg('1.0.0'), // Prevents previous leftPad from being hoisted
    });
    // WHEN
    (0, hoisting_1.hoistDependencies)(tree);
    // THEN
    expect((0, hoisting_1.renderTree)(tree)).toEqual([
        'leftPad=1.0.0',
        'spacemaker=10.0.0',
        'stringutil=1.0.0',
        'stringutil.leftPad=2.0.0',
        'stringutil.leftPad.spacemaker=3.0.0',
    ]);
});
test('order of hoisting shouldnt produce a broken situation', () => {
    // GIVEN
    const tree = pkg('*', {
        stringutil: pkg('1.0.0', {
            wrapper: pkg('100.0.0', {
                leftPad: pkg('2.0.0', {
                    spacemaker: pkg('3.0.0'),
                }),
            }),
            spacemaker: pkg('4.0.0'), // Prevents spacemaker from being hoisted here, but then leftPad also shouldn't be
        }),
    });
    // WHEN
    (0, hoisting_1.hoistDependencies)(tree);
    // THEN
    /* // Both answers are fine but the current algorithm picks the 2nd
    expect(renderTree(tree)).toEqual([
      'leftPad=2.0.0',
      'spacemaker=3.0.0',
      'stringutil=1.0.0',
      'stringutil.spacemaker=4.0.0',
      'wrapper=100.0.0',
    ]);
    */
    expect((0, hoisting_1.renderTree)(tree)).toEqual([
        'leftPad=2.0.0',
        'leftPad.spacemaker=3.0.0',
        'spacemaker=4.0.0',
        'stringutil=1.0.0',
        'wrapper=100.0.0',
    ]);
});
function pkg(version, dependencies) {
    return {
        version,
        ...dependencies ? { dependencies } : undefined,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9pc3RpbmcudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvaXN0aW5nLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBZ0U7QUFLaEUsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtJQUM5QyxRQUFRO0lBQ1IsTUFBTSxJQUFJLEdBQW1CLEdBQUcsQ0FBQyxHQUFHLEVBQUU7UUFDcEMsVUFBVSxFQUFFO1lBQ1YsT0FBTyxFQUFFLE9BQU87WUFDaEIsWUFBWSxFQUFFO2dCQUNaLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7YUFDOUI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFlBQVksRUFBRTtnQkFDWixLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO2FBQzVCO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsSUFBQSw0QkFBaUIsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUV4QixPQUFPO0lBQ1AsTUFBTSxDQUFDLElBQUEscUJBQVUsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMvQixhQUFhO1FBQ2IsZUFBZTtRQUNmLGVBQWU7UUFDZixrQkFBa0I7S0FDbkIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLFFBQVE7SUFDUixNQUFNLElBQUksR0FBbUIsR0FBRyxDQUFDLEdBQUcsRUFBRTtRQUNwQyxVQUFVLEVBQUU7WUFDVixPQUFPLEVBQUUsT0FBTztZQUNoQixZQUFZLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTthQUM5QjtTQUNGO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLE9BQU87WUFDaEIsWUFBWSxFQUFFO2dCQUNaLE9BQU8sRUFBRSxFQUFFLE9B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VHJlZSB9IGZyb20gJy4uL2xpYi9ob2lzdGluZyc7XG5pbXBvcnQgeyBQYWNrYWdlTG9ja1BhY2thZ2UgfSBmcm9tICcuLi9saWIvdHlwZXMnO1xuXG50eXBlIERlcGVuZGVuY3lUcmVlID0gUGFja2FnZUxvY2tQYWNrYWdlO1xuXG50ZXN0KCdub25jb25mbGljdGluZyB0cmVlIGdldHMgZmxhdHRlbmVkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB0cmVlOiBEZXBlbmRlbmN5VHJlZSA9IHBrZygnKicsIHtcbiAgICBzdHJpbmd1dGlsOiB7XG4gICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICAgIGxlZnRwYWQ6IHsgdmVyc2lvbjogJzIuMC4wJyB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG51bXV0aWw6IHtcbiAgICAgIHZlcnNpb246ICczLjAuMCcsXG4gICAgICBkZXBlbmRlbmNpZXM6IHtcbiAgICAgICAgaXNvZGQ6IHsgdmVyc2lvbjogJzQuMC4wJyB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGhvaXN0RGVwZW5kZW5jaWVzKHRyZWUpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHJlbmRlclRyZWUodHJlZSkpLnRvRXF1YWwoW1xuICAgICdpc29kZD00LjAuMCcsXG4gICAgJ2xlZnRwYWQ9Mi4wLjAnLFxuICAgICdudW11dGlsPTMuMC4wJyxcbiAgICAnc3RyaW5ndXRpbD0xLjAuMCcsXG4gIF0pO1xufSk7XG5cbnRlc3QoJ21hdGNoaW5nIHZlcnNpb25zIGdldCBkZWR1cGVkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB0cmVlOiBEZXBlbmRlbmN5VHJlZSA9IHBrZygnKicsIHtcbiAgICBzdHJpbmd1dGlsOiB7XG4gICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICAgIGxlZnRwYWQ6IHsgdmVyc2lvbjogJzIuMC4wJyB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG51bXV0aWw6IHtcbiAgICAgIHZlcnNpb246ICczLjAuMCcsXG4gICAgICBkZXBlbmRlbmNpZXM6IHtcbiAgICAgICAgbGVmdHBhZDogeyB2ZXJzaW9uOiAnMi4wLjAnIH0sXG4gICAgICAgIGlzb2RkOiB7IHZlcnNpb246ICc0LjAuMCcgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBob2lzdERlcGVuZGVuY2llcyh0cmVlKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChyZW5kZXJUcmVlKHRyZWUpKS50b0VxdWFsKFtcbiAgICAnaXNvZGQ9NC4wLjAnLFxuICAgICdsZWZ0cGFkPTIuMC4wJyxcbiAgICAnbnVtdXRpbD0zLjAuMCcsXG4gICAgJ3N0cmluZ3V0aWw9MS4wLjAnLFxuICBdKTtcbn0pO1xuXG50ZXN0KCdjb25mbGljdGluZyB2ZXJzaW9ucyBnZXQgbGVmdCBpbiBwbGFjZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgdHJlZTogRGVwZW5kZW5jeVRyZWUgPSBwa2coJyonLCB7XG4gICAgc3RyaW5ndXRpbDoge1xuICAgICAgdmVyc2lvbjogJzEuMC4wJyxcbiAgICAgIGRlcGVuZGVuY2llczoge1xuICAgICAgICBsZWZ0cGFkOiB7IHZlcnNpb246ICcyLjAuMCcgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBudW11dGlsOiB7XG4gICAgICB2ZXJzaW9uOiAnMy4wLjAnLFxuICAgICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICAgIGxlZnRwYWQ6IHsgdmVyc2lvbjogJzUuMC4wJyB9LFxuICAgICAgICBpc29kZDogeyB2ZXJzaW9uOiAnNC4wLjAnIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgaG9pc3REZXBlbmRlbmNpZXModHJlZSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QocmVuZGVyVHJlZSh0cmVlKSkudG9FcXVhbChbXG4gICAgJ2lzb2RkPTQuMC4wJyxcbiAgICAnbGVmdHBhZD0yLjAuMCcsXG4gICAgJ251bXV0aWw9My4wLjAnLFxuICAgICdudW11dGlsLmxlZnRwYWQ9NS4wLjAnLFxuICAgICdzdHJpbmd1dGlsPTEuMC4wJyxcbiAgXSk7XG59KTtcblxudGVzdCgnZGVwZW5kZW5jaWVzIG9mIGRlZHVwZWQgcGFja2FnZXMgYXJlIG5vdCBob2lzdGVkIGludG8gdXNlbGVzcyBwb3NpdGlvbnMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHRyZWU6IERlcGVuZGVuY3lUcmVlID0gcGtnKCcqJywge1xuICAgIHN0cmluZ3V0aWw6IHBrZygnMS4wLjAnLCB7XG4gICAgICBsZWZ0cGFkOiBwa2coJzIuMC4wJywge1xuICAgICAgICBzcGFjZW1ha2VyOiBwa2coJzMuMC4wJyksXG4gICAgICB9KSxcbiAgICB9KSxcbiAgICBsZWZ0cGFkOiBwa2coJzIuMC4wJywge1xuICAgICAgc3BhY2VtYWtlcjogcGtnKCczLjAuMCcpLFxuICAgIH0pLFxuICAgIHNwYWNlbWFrZXI6IHBrZygnNC4wLjAnKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBob2lzdERlcGVuZGVuY2llcyh0cmVlKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChyZW5kZXJUcmVlKHRyZWUpKS50b0VxdWFsKFtcbiAgICAnbGVmdHBhZD0yLjAuMCcsXG4gICAgJ2xlZnRwYWQuc3BhY2VtYWtlcj0zLjAuMCcsXG4gICAgJ3NwYWNlbWFrZXI9NC4wLjAnLFxuICAgICdzdHJpbmd1dGlsPTEuMC4wJyxcbiAgXSk7XG59KTtcblxudGVzdCgnZG9udCBob2lzdCBpbnRvIGEgcGFyZW50IGlmIGl0IHdvdWxkIGNhdXNlIGFuIGluY29ycmVjdCB2ZXJzaW9uIHRoZXJlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB0cmVlOiBEZXBlbmRlbmN5VHJlZSA9IHBrZygnKicsIHtcbiAgICBzdHJpbmd1dGlsOiBwa2coJzEuMC4wJywge1xuICAgICAgc3BhY2VtYWtlcjogcGtnKCcxMC4wLjAnKSxcbiAgICAgIGxlZnRQYWQ6IHBrZygnMi4wLjAnLCB7XG4gICAgICAgIHNwYWNlbWFrZXI6IHBrZygnMy4wLjAnKSxcbiAgICAgIH0pLFxuICAgIH0pLFxuICAgIGxlZnRQYWQ6IHBrZygnMS4wLjAnKSwgLy8gUHJldmVudHMgcHJldmlvdXMgbGVmdFBhZCBmcm9tIGJlaW5nIGhvaXN0ZWRcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBob2lzdERlcGVuZGVuY2llcyh0cmVlKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChyZW5kZXJUcmVlKHRyZWUpKS50b0VxdWFsKFtcbiAgICAnbGVmdFBhZD0xLjAuMCcsXG4gICAgJ3NwYWNlbWFrZXI9MTAuMC4wJyxcbiAgICAnc3RyaW5ndXRpbD0xLjAuMCcsXG4gICAgJ3N0cmluZ3V0aWwubGVmdFBhZD0yLjAuMCcsXG4gICAgJ3N0cmluZ3V0aWwubGVmdFBhZC5zcGFjZW1ha2VyPTMuMC4wJyxcbiAgXSk7XG59KTtcblxudGVzdCgnb3JkZXIgb2YgaG9pc3Rpbmcgc2hvdWxkbnQgcHJvZHVjZSBhIGJyb2tlbiBzaXR1YXRpb24nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHRyZWU6IERlcGVuZGVuY3lUcmVlID0gcGtnKCcqJywge1xuICAgIHN0cmluZ3V0aWw6IHBrZygnMS4wLjAnLCB7XG4gICAgICB3cmFwcGVyOiBwa2coJzEwMC4wLjAnLCB7XG4gICAgICAgIGxlZnRQYWQ6IHBrZygnMi4wLjAnLCB7XG4gICAgICAgICAgc3BhY2VtYWtlcjogcGtnKCczLjAuMCcpLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgICAgc3BhY2VtYWtlcjogcGtnKCc0LjAuMCcpLCAvLyBQcmV2ZW50cyBzcGFjZW1ha2VyIGZyb20gYmVpbmcgaG9pc3RlZCBoZXJlLCBidXQgdGhlbiBsZWZ0UGFkIGFsc28gc2hvdWxkbid0IGJlXG4gICAgfSksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgaG9pc3REZXBlbmRlbmNpZXModHJlZSk7XG5cbiAgLy8gVEhFTlxuICAvKiAvLyBCb3RoIGFuc3dlcnMgYXJlIGZpbmUgYnV0IHRoZSBjdXJyZW50IGFsZ29yaXRobSBwaWNrcyB0aGUgMm5kXG4gIGV4cGVjdChyZW5kZXJUcmVlKHRyZWUpKS50b0VxdWFsKFtcbiAgICAnbGVmdFBhZD0yLjAuMCcsXG4gICAgJ3NwYWNlbWFrZXI9My4wLjAnLFxuICAgICdzdHJpbmd1dGlsPTEuMC4wJyxcbiAgICAnc3RyaW5ndXRpbC5zcGFjZW1ha2VyPTQuMC4wJyxcbiAgICAnd3JhcHBlcj0xMDAuMC4wJyxcbiAgXSk7XG4gICovXG4gIGV4cGVjdChyZW5kZXJUcmVlKHRyZWUpKS50b0VxdWFsKFtcbiAgICAnbGVmdFBhZD0yLjAuMCcsXG4gICAgJ2xlZnRQYWQuc3BhY2VtYWtlcj0zLjAuMCcsXG4gICAgJ3NwYWNlbWFrZXI9NC4wLjAnLFxuICAgICdzdHJpbmd1dGlsPTEuMC4wJyxcbiAgICAnd3JhcHBlcj0xMDAuMC4wJyxcbiAgXSk7XG59KTtcblxuZnVuY3Rpb24gcGtnKHZlcnNpb246IHN0cmluZywgZGVwZW5kZW5jaWVzPzogUmVjb3JkPHN0cmluZywgUGFja2FnZUxvY2tQYWNrYWdlPik6IFBhY2thZ2VMb2NrUGFja2FnZSB7XG4gIHJldHVybiB7XG4gICAgdmVyc2lvbixcbiAgICAuLi5kZXBlbmRlbmNpZXM/IHsgZGVwZW5kZW5jaWVzIH0gOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbiJdfQ==