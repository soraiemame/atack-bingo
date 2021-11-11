#ifdef _DEBUG
#ifdef _SORAIE
#define _GLIBCXX_DEBUG
#endif
#endif

#include <bits/stdc++.h>

#pragma GCC target("avx2")
#pragma GCC optimize("O3")
#pragma GCC optimize("unroll-loops")

using namespace std;
//--------------------------------------------------------------------
#define all(a) (a).begin(),(a).end()
#define rall(a) (a).rbegin(),(a).rend()
#define overload4(_1,_2,_3,_4,name,...) name
#define rep1(n) for(ll _ThiS_WoNt_Be_usEd=0;_ThiS_WoNt_Be_usEd<(ll)n;++_ThiS_WoNt_Be_usEd)
#define rep2(i,n) for(ll i=0;i<(ll)n;++i)
#define rep3(i,a,b) for(ll i=(ll)a;i<(ll)b;++i)
#define rep4(i,a,b,c) for(ll i=(ll)a;i<(ll)b;i+=(ll)c)
#define rep(...) overload4(__VA_ARGS__,rep4,rep3,rep2,rep1)(__VA_ARGS__)
#define mp make_pair
struct asdfghjkl{asdfghjkl(){ios::sync_with_stdio(false);cin.tie(0);cout.tie(0);}} qwertyuiop;
using ll = long long;
template<class First,class Second>ostream& operator<<(ostream& os,const pair<First,Second>& pp)
{return os << "{" << pp.first << "," << pp.second << "}";}
template<class T>ostream& operator<<(ostream& os,const vector<T>& VV)
{if(VV.empty())return os<<"[]";os<<"[";rep(i,VV.size())os<<VV[i]<<(i==int(VV.size()-1)?"]":",");return os;}
template<class T>ostream& operator<<(ostream& os,const set<T>& SS)
{if(SS.empty())return os<<"[]";os<<"[";auto ii=SS.begin();for(;ii!=SS.end();ii++)os<<*ii<<(ii==prev(SS.end())?"]":",");return os;}
template<class Key,class Tp>ostream& operator<<(ostream& os,const map<Key,Tp>& MM)
{if(MM.empty())return os<<"[]";os<<"[";auto ii=MM.begin();for(;ii!=MM.end();ii++)os<<"{"<<ii->first<<":"<<ii->second<<"}"<<(ii==prev(MM.end())?"]":",");return os;}
using pii = pair<int,int>;
//--------------------------------------------------------------------

constexpr int N = 4;

static_assert(N <= 4);

vector<vector<int>> op; // opponent
vector<pii> ps;
int T;

vector<vector<int>> i2v(int B){
    vector<vector<int>> res(N,vector<int>(N));
    rep(i,N){
        rep(j,N)res[i][j] = B >> (i * N + j) & 1;
    }
    return res;
}

struct Game{
    int t = 0;
    int A = 0,B = 0;
    bool get(int t,int x,int y) const {
        return (t ? B : A) >> (x * N + y) & 1;
    }
    void set(int t,int x,int y,bool b) {
        int c = x * N + y;
        if(!t)A = b ? (A | (1 << c)) : (A & ~(1 << c));
        else B = b ? (B | (1 << c)) : (B & ~(1 << c));
    }
    int win() const {
        bool a = false,b = false;
        bool ok;
        rep(i,N){
            ok = 1;
            rep(j,N)if(get(0,i,j) != 1)ok = 0;
            if(ok)a = 1;
        }
        rep(i,N){
            ok = 1;
            rep(j,N)if(get(0,j,i) != 1)ok = 0;
            if(ok)a = 1;
        }
        ok = 1;
        rep(i,N)if(get(0,i,i) != 1)ok = 0;
        if(ok)a = 1;
        ok = 1;
        rep(i,N)if(get(0,i,N - i - 1) != 1)ok = 0;
        if(ok)a = 1;

        rep(i,N){
            ok = 1;
            rep(j,N)if(get(1,i,j) != 1)ok = 0;
            if(ok)b = 1;
        }
        rep(i,N){
            ok = 1;
            rep(j,N)if(get(1,j,i) != 1)ok = 0;
            if(ok)b = 1;
        }
        ok = 1;
        rep(i,N)if(get(1,i,i) != 1)ok = 0;
        if(ok)b = 1;
        ok = 1;
        rep(i,N)if(get(1,i,N - i - 1) != 1)ok = 0;
        if(ok)b = 1;

        if(a && b)return t;
        else if(a)return 1;
        else if(b)return 0;
        else return -1;
    }
    friend ostream& operator<<(ostream& os,const Game& g) {
        return os << i2v(g.A) << ", " << i2v(g.B)
        << ", turn: " << (g.t ? "B" : "A");
    }
};

vector<vector<int>> memo;

int rec(Game& g){
    if(memo[g.t][g.A] != -1)return memo[g.t][g.A];
    int res = 1 - g.t;
    int w = g.win();
    if(w == g.t)res = g.t;
    else if(w == 1 - g.t)res = 1 - g.t;
    else{
        rep(i,N){
            rep(j,N){
                if(g.get(0,i,j) == 0){
                    auto [x,y] = ps[i * N + j];
                    g.set(0,i,j,1);
                    g.set(1,x,y,1);
                    g.t = 1 - g.t;
                    w = g.win();
                    int rg = rec(g);
                    g.set(0,i,j,0);
                    g.set(1,x,y,0);
                    g.t = 1 - g.t;
                    if(w == g.t || rg == g.t){
                        res = g.t;
                        break;
                    }
                    
                }
            }
            if(res == g.t)break;
        }
    }
    return memo[g.t][g.A] = res;
}

pair<int,bool> nxt(Game& g) {
    int w;
    int d = -1;
    rep(i,N){
        rep(j,N){
            if(g.get(0,i,j) == 0){
                auto [x,y] = ps[i * N + j];
                g.set(0,i,j,1);
                g.set(1,x,y,1);
                g.t = 1 - g.t;
                w = g.win();
                int rg = rec(g);
                g.set(0,i,j,0);
                g.set(1,x,y,0);
                g.t = 1 - g.t;
                if(w == g.t || rg == g.t){
                    return mp(i * N + j,true);
                }
                else if(w != -1 || d == -1)d = i * N + j;
            }
        }
    }
    return mp(d,false);
}

void play(Game& g){
    cout << "user input" << endl;
    int n;
    cin >> n;
    int a = n / N,b = n % N;
    while(g.get(0,a,b) == 1){
        cout << "Invalid" << endl;
        cin >> n;
        a = n / N;
        b = n % N;
    }
    auto [x,y] = ps[n];
    g.set(0,n / N,n % N,1);
    g.set(1,x,y,1);
    g.t = 1 - g.t;
}

void cpu(Game& g){
    auto [n,b] = nxt(g);
    cout << "cpu play: " << n << "\n";
    auto [x,y] = ps[n];
    cout << (b ? "computer wil win" : "player will win") << "\n";
    g.set(0,n / N,n % N,1);
    g.set(1,x,y,1);
    g.t = 1 - g.t;
}

void dump(Game& g){
    auto a = i2v(T == 0 ? g.A : g.B);
    auto b = i2v(T == 0 ? g.B : g.A);
    cout << "You\n";
    rep(i,N)cout << a[i] << "\n";
    cout << "CPU\n";
    rep(i,N)cout << b[i] << "\n";
}

int main(){
    op = vector<vector<int>>(N,vector<int>(N));
    ps = vector<pii>(N * N);
    memo = vector<vector<int>>(2,vector<int>(1 << (N * N),-1));
    rep(i,N)rep(j,N)cin >> op[i][j];
    rep(i,N){
        rep(j,N){
            ps[op[i][j]] = mp(i,j);
        }
    }
    cout << "?turn" << endl;
    cin >> T;
    Game cur;
    cout << rec(cur) << "\n";
    while(true){
        if(T == 0){
            play(cur);
            dump(cur);
            if(cur.win() != -1){
                cout << "game ended\n";
                break;
            }
            cpu(cur);
            dump(cur);
            if(cur.win() != -1){
                cout << "game ended\n";
                break;
            }
        }
        else{
            cpu(cur);
            dump(cur);
            if(cur.win() != -1){
                cout << "game ended\n";
                break;
            }
            play(cur);
            dump(cur);
            if(cur.win() != -1){
                cout << "game ended\n";
                break;
            }
        }
    }
}