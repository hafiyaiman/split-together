import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants/site";

export const alt =
  "SplitTogether Open Graph image with logo, bold bill-splitting headline, and ASCII art.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const HERO_ASCII = `
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                       ###                       %%%                                                
                       %##          %#########%%%%%%%######%                                        
                ###%     %     %####### %%##############%##%                                        
                 %###      %####% %########################%                                        
                       ##### %%##########% #####   %########       %#######                         
                     #### ######### ###%%   ###   #########      %##%%#% #####              #       
                   %%% #######%  %% %###%    ##  #%######       %#%%####### #####         ###%      
                %##% %#####%%   %##   % %%####%%##%#####       ######%  ###### %###      ###        
               %## ###########    ########%######%####       %## %%### %########% ###               
             %#% %####%   %####  ###%###%%%%%%%#% %###      %#%%#%%   #####   ####% ###     %###### 
            ##% ########      %##%####%%%%%%%%%%%######     ###%%%#####      #######  ###           
           ##% ############ %########@@%%%% %%########%     ####%%#####   ###########% ##%          
          %# %####        ##########% % %% %##%######        ####%%###%######     ##### ##%         
         %# %#%######     ##%######%%%%#%%%%%#%#####      ####% @ %#######      ######## %#%        
        ##% ############%#########% % %%##%#######       ###% %%%%%######## ############# ##        
        ## %#######     #########%@% %%%%####% ###%    %##%%#%%%%%%%#######% %%%%######## ##%       
        %# %######      #%######%%% %%%##%##% ######   ###% % %% %%%######%#       ######  ##       
       %%% %%##########%# #####% %%%%###%###########%  ###%##### %% ###### ####%%%######%% %%       
       %#% %%#######%  %# ###%% %%%% ###%##%%########  %###%#%%% % %#####% ## ##%########% %%%      
       %#% %%##         #%## % %% % ##       %#######%  %####%%% % %###### #%        ####% %#%      
       %## %########%#####%#% %% %%##       #########%  ###%#%%% % % ####################% ##%      
       ### %##########   ##%#%% %%##       #########  ###%  #%%% % %%####%#  ##########%# %##%      
       %##  #######      #######%###    ###%#####% %###     #%%% %%@% #####      ######## %##%      
        ### %#%##    %%###%##%#######   ##%#####  #####     #%%% %%%%########      #####% ###       
        #### %###########   ##########   %%####  #####%    ##%%% %#######  ##########%#% ####       
        ##### %#%#####%      #################  ##       ########## ##%      #########% ####%       
         ##### %#####    #####  %############  %###%%###########%###%%####     ######% %####        
          #####  ############      #%%######%  %#%###########%####     #############% #####%        
           #####% %#########     ##%%######   %#% %%    %#####  %##     ##########%  #####%         
            ######% #######%  ###%%#######  %##%%#####%%  ##     #####   ########  ######%          
             %####### %###%###   #######   %##    ###     ###    ##############  #######%           
               ########  %#############   %##%    ###     #####   ##########%  %#######             
                %#########  %########%  %##%%    #####    #######%#####%##  #########%              
                  %#################    ###%    ######## ########%#####  %####%####%                
                     %############%   %###%%%###########%%%%####%%   ######%#####%                  
                       %#######%%    ##%   %%###########%%%    %%######%%#%####                     
                           %###%     ###########%%%%%%############%## ######%                       
                                     #################### %%%%%% %%%####                            
                                     ####################%########%%                                
                                         %%%##########%%%%%##%%                                     
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
`.slice(1, -1);

function toDataUrl(buffer: Buffer, type: string) {
  return `data:${type};base64,${buffer.toString("base64")}`;
}

export default async function OpenGraphImage() {
  const logoBuffer = await readFile(
    path.join(process.cwd(), "public/logo/logo.png"),
  );

  const logoDataUrl = toDataUrl(logoBuffer, "image/png");

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        background:
          "linear-gradient(135deg, #fafaf8 0%, #fff7ee 55%, #eefdfa 100%)",
        color: "#121212",
        fontFamily: '"Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(18,18,18,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(18,18,18,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 72,
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(18,18,18,0.1)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 68,
          top: 68,
          width: 314,
          height: 314,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(16,179,163,0.28) 0%, rgba(16,179,163,0.08) 45%, rgba(16,179,163,0) 74%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: -10,
          bottom: -80,
          width: 416,
          height: 418,
          display: "flex",
          overflow: "hidden",
          opacity: 0.16,
          transform: "rotate(-2deg)",
        }}
      >
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre",
            fontSize: 10,
            lineHeight: 1.06,
            color: "#121212",
            fontFamily:
              '"SFMono-Regular", "Menlo", "Monaco", "Courier New", monospace',
          }}
        >
          {HERO_ASCII}
        </pre>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "56px 64px 52px 112px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 690,
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  padding: "10px 14px",
                  borderRadius: 9999,
                  border: "1px solid rgba(18,18,18,0.1)",
                  background: "rgba(255,255,255,0.74)",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Bill Split //
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#61594d",
                }}
              >
                No awkward math
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 76,
                lineHeight: 0.92,
                fontWeight: 700,
                letterSpacing: "-0.08em",
              }}
            >
              <div style={{ display: "flex" }}>Split bills.</div>
              <div style={{ display: "flex" }}>Show exactly</div>
              <div style={{ display: "flex" }}>who owes whom.</div>
            </div>

            <div
              style={{
                display: "flex",
                maxWidth: 620,
                fontSize: 27,
                lineHeight: 1.45,
                color: "#4f463c",
              }}
            >
              {SITE_DESCRIPTION}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 68,
                height: 68,
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(18,18,18,0.12)",
                background: "#ffffff",
              }}
            >
              <img
                src={logoDataUrl}
                alt=""
                width="68"
                height="68"
                style={{ width: "68px", height: "68px" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 34,
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                }}
              >
                {SITE_NAME}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#10b3a3",
                  fontWeight: 700,
                }}
              >
                Free expense settlement tool
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 308,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-end",
              padding: "10px 14px",
              borderRadius: 9999,
              background: "#121212",
              color: "#fafaf8",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Who pays whom
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              border: "1px solid rgba(18,18,18,0.12)",
              background: "rgba(255,255,255,0.72)",
              padding: "20px 22px",
              boxShadow: "0 22px 80px rgba(27,17,7,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 28,
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: "-0.05em",
              }}
            >
              <div style={{ display: "flex" }}>No more group chat math.</div>
              <div style={{ display: "flex" }}>
                Send one clean payment list.
              </div>
              <div style={{ display: "flex", color: "#10b3a3" }}>
                Settle dinner, trips, rent.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
