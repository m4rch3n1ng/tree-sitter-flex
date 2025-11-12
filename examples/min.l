%{
#include "y.tab.h"
%}

digit [0-9]

%%

"+"      { return ADD }

%%
